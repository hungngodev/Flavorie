from app import create_app
import redis
import os
from dotenv import load_dotenv
from threading import Thread
import json
import logging
from app.db import init_db
from flask import request, jsonify
app = create_app()
load_dotenv()

if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    app.logger.setLevel(logging.INFO)
    redis_client= redis.StrictRedis.from_url(os.getenv("REDIS_URL"))
    app.logger.info("Connected to Redis in Flask")
    app.config['MONGO_URI'] = os.getenv("MONGO_URI")
    mongo_client = init_db(app)
    app.logger.info("Connected to MongoDB in Flask")
    

    def consume_stream():
        stream_key = 'server:receipts_stream'
        response_stream = 'services:receipts_stream'
        last_id = '$'  # Start from the latest entry

        while True:
            try:
                # Read from the stream
                response = redis_client.xread({stream_key: last_id}, block=0, count=1)
                
                if response:
                    # response format: [(stream_key, [(entry_id, entry_data)])]
                    stream_name, messages = response[0]
                    
                    for message_id, message_data in messages:
                        app.logger.info(f"Received message: {message_data}")

                        # Update last_id to process only new messages
                        last_id = message_id
                redis_client.xadd(response_stream, {"message": "Received message"}, maxlen=1000)
            except redis.exceptions.ConnectionError as e:
                print(f"Redis connection error: {e}")

    
    # def scan_receipt():
    #     if "receipt" not in request.form:
    #         return jsonify({"error": "No receipt variables"}), 400

    #     # img_url received from nodejs
    #     img_url = request.form["receipt"]

    #     if img_url == "":
    #         return jsonify({"error": "No selected file"}), 400
    #     try:
    #         # fetch img data from url, stream=True allows writing even when the download is not done
    #         response = requests.get(img_url, stream=True)

    #         # if error occur, return httperror object
    #         response.raise_for_status()

    #         # response.content is in bytes
    #         img = Image.open(BytesIO(response.content)).convert("RGB")
    #         final_res = process_receipt_task(img, main.mongo_client)
    #         return final_res

    #     except Exception as e:
    #         return jsonify({"error": str(e)}), 500
    consume_stream()
    
    app.run(port=5000, debug=True)