from flask_pymongo import pymongo
from pymongo import MongoClient

def init_db(app):
    client = MongoClient(app.config["MONGO_URI"])
    return client
