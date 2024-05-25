from app import create_app
from flask_socketio import SocketIO
# from pymongo import MongoClient
import os
from flask_pymongo import PyMongo
# from dotenv import load_dotenv

# load_dotenv()



# MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/test')


# client = MongoClient(MONGO_URI)
# db = client.get_database()

app, executor = create_app()
# app.config["MONGO_URI"] = os.getenv("MONGODB_URL")
# mongo = PyMongo(app)

# socketio = SocketIO(app)
# app.socketio = socketio
# app.db = mongo.db


if __name__ == '__main__':
    app.run(port=5000, debug=True)