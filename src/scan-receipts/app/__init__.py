from flask import Flask 
from flask_executor import Executor
import os
from dotenv import load_dotenv
from flask_socketio import SocketIO
from flask_pymongo import PyMongo

load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config["MONGO_URI"] = os.getenv("MONGODB_URL")
    mongo = PyMongo(app)
    app.db = mongo.db

    executor = Executor(app)
    app.executor = executor

    # socketio = SocketIO(app)
    # app.socketio = socketio
    

    
    from app.routes import main
    app.register_blueprint(main)

    #Cofigure Flask-Executor
    # executor = Executor(app)
    # app.executor = executor

    
    return app, executor
