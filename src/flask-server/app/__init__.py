from flask import Flask
from app.db import init_db
from dotenv import load_dotenv
from flask_cors import CORS, cross_origin

import os
def create_app():
    app = Flask(__name__)
    # print(app.config['MONGO_URI'])
    cors = CORS(app)
    app.config['CORS_HEADERS'] = 'Content-Type'
    from app.routes import main

    app.register_blueprint(main)
    return app
