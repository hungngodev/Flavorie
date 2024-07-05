from flask import Flask
from app.db import init_db
from dotenv import load_dotenv
from flask_cors import CORS, cross_origin

import os
def create_app():
    app = Flask(__name__)
    load_dotenv(os.path.join(os.path.dirname(__file__), '../.env'))
    app.config['MONGO_URI'] = os.getenv("MONGO_URI")
    # print(app.config['MONGO_URI'])
    cors = CORS(app)
    app.config['CORS_HEADERS'] = 'Content-Type'
    
    mongo_client = init_db(app)
    from app.routes import main

    app.register_blueprint(main)
    main.mongo_client = mongo_client
    return app
