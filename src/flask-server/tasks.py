import redis
from celery import Celery
import time
from dotenv import load_dotenv
import logging
import os
from pymongo import MongoClient
from app.receipts import scan_receipt
import datetime
import json
load_dotenv()

logger = logging.getLogger(__name__)
app = Celery('tasks', broker=os.getenv('REDIS_URL'), backend=os.getenv('REDIS_URL'))

redis_client = redis.StrictRedis.from_url(os.getenv("REDIS_URL"))


@app.task
def process_message(message_id, message_data, consumer_name):
    # Add your processing logic here
    logger.info(f"Processing message {message_id}: {message_data}" + " by worker " + consumer_name)

@app.task
def handle_receipts_stream(consumer_name):
    stream_key = 'server:receipts_stream'
    consumer_group = 'my_group'
    last_id = '>'
    logger.info(f"Starting receipts stream {consumer_name}")
    mongo_client = MongoClient(os.getenv("MONGO_URI"))
    db = mongo_client[os.getenv("MONGO_DB_NAME")]
    collection = db['notifications']
    # Ensure the consumer group is created
    try:
        redis_client.xgroup_create(stream_key, consumer_group, id='0', mkstream=True)
    except redis.exceptions.ResponseError as e:
        if 'BUSYGROUP Consumer Group name already exists' not in str(e):
            raise

    while True:
        try:
            logger.info(f"Consumer {consumer_name} reading from stream")
            # Read from the stream using the consumer group
            response = redis_client.xreadgroup(
                consumer_group, 
                consumer_name,
                {stream_key: '>'},
                block=100000000, count=1
            )
         
            if response:
                stream_name, messages = response[0]
                
                for message_id, message_data in messages:
                    if isinstance(message_id, bytes):
                        message_id = message_id.decode('utf-8')
        
                    if isinstance(message_data, dict):
                        message_data = {k.decode('utf-8'): v.decode('utf-8') if isinstance(v, bytes) else v
                                        for k, v in message_data.items()}

                    # process_message.delay(message_id, message_data, consumer_name)
                    last_id = message_id
                    logger.info("current last_id: " + last_id)
                    
                    user_id = message_data['userId']
                    timestamp = datetime.datetime.now()
                    receipt_url = message_data['receipt']

                    result = scan_receipt(receipt_url, mongo_client)
                    logger.info("Processing done")
                    redis_client.xack(stream_key, consumer_group, message_id)
                    
                    new_noti = collection.insert_one({
                        "userId": user_id,
                        "status": True,
                        "message": {
                            "title": 'Process receipt successfully',
                            "data": result,
                            "notificationType": "receipt",    
                        },
                        "timestamp": timestamp
                    })
                        
                    logger.info("Notification created: " + str(new_noti.inserted_id))
                    # redis_client.xadd('services:receipts_stream', 
                    #     {
                    #     "message": "Received message of " + "worker" + consumer_name,
                    #     "Processed_URL": message_data['receipt'],
                    #     "result": json.dumps(result)
                    #     }, maxlen=1000)
            
            time.sleep(5)
        except redis.exceptions.ConnectionError as e:
            print(f"Redis connection error: {e}")

# @app.task
# def handle_gestures_stream(consumer_name):
#     stream_key = 'server:gestures_stream'
#     consumer_group = 'my_group'
#     last_id = '>'
#     logger.info(f"Starting gesture {consumer_name}")
#     # Ensure the consumer group is created
#     try:
#         redis_client.xgroup_create(stream_key, consumer_group, id='0', mkstream=True)
#     except redis.exceptions.ResponseError as e:
#         if 'BUSYGROUP Consumer Group name already exists' not in str(e):
#             raise

#     while True:
#         try:
#             logger.info(f"Consumer {consumer_name} reading from stream")
#             # Read from the stream using the consumer group
#             response = redis_client.xreadgroup(
#                 consumer_group, 
#                 consumer_name,
#                 {stream_key: '>'},
#                 block=100000000, count=1
#             )
         
#             if response:
#                 stream_name, messages = response[0]
                
#                 for message_id, message_data in messages:
#                     if isinstance(message_id, bytes):
#                         message_id = message_id.decode('utf-8')
        
#                     if isinstance(message_data, dict):
#                         message_data = {k.decode('utf-8'): v.decode('utf-8') if isinstance(v, bytes) else v
#                                         for k, v in message_data.items()}

#                     # process_message.delay(message_id, message_data, consumer_name)
#                     last_id = message_id
#                     logger.info("current last_id: " + last_id)
                    
#                     # Update last_id to process only new messages
#                     logger.info("Processing done")
#                     redis_client.xack(stream_key, consumer_group, message_id)
                        
#                     redis_client.xadd('services:gestures_stream', 
#                         {
#                         "message": "Received message of " + "worker" + consumer_name,
#                         "Processed_URL": message_data['gesture'],
#                         "result": json.dumps(result)
#                         }, maxlen=1000)
            
#             time.sleep(5)
#         except redis.exceptions.ConnectionError as e:
#             print(f"Redis connection error: {e}")