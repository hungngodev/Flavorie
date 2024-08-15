import redis
from celery import Celery
import time
from dotenv import load_dotenv
import os
load_dotenv()
# Initialize Celery
app = Celery('tasks', broker=os.getenv('REDIS_URL'), backend=os.getenv('REDIS_URL'))

# Initialize Redis client
redis_client = redis.StrictRedis.from_url(os.getenv("REDIS_URL"))

@app.task
def process_message(message_id, message_data):
    # Add your processing logic here
    print(f"Processing message ID: {message_id}, Data: {message_data}")

@app.task
def consume_stream(consumer_name):
    stream_key = 'server:receipts_stream'
    consumer_group = 'my_group'
    last_id = '>'

    # Ensure the consumer group is created
    try:
        redis_client.xgroup_create(stream_key, consumer_group, id='0', make_stream=True)
    except redis.exceptions.ResponseError as e:
        if 'BUSYGROUP Consumer Group name already exists' not in str(e):
            raise

    while True:
        try:
            # Read from the stream using the consumer group
            response = redis_client.xreadgroup(
                consumer_group, consumer_name,
                {stream_key: last_id},
                block=0, count=1
            )

            if response:
                stream_name, messages = response[0]
                
                for message_id, message_data in messages:
                    # Dispatch a task to process the message
                    process_message.delay(message_id, message_data)
                    
                    # Update last_id to process only new messages
                    last_id = message_id

            redis_client.xack(stream_key, consumer_group, message_id)
            
            redis_client.xadd('services:receipts_stream', {"message": "Received message"}, maxlen=1000)
            
        except redis.exceptions.ConnectionError as e:
            print(f"Redis connection error: {e}")

        time.sleep(10000)  # Sleep to avoid overwhelming the Redis server
