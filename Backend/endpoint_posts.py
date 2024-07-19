from flask_restx import Api, Namespace, Resource, reqparse
from flask import Flask
from database_extensions import database_extensions
import logging
import os
from dotenv import load_dotenv
from function_is_valid_advert import is_valid_basic_advert, is_valid_custom_advert
from function_generate_default_text_advert import *
from datetime import date

load_dotenv()
logging.basicConfig(level=os.getenv("logLevel"), format=str(os.getenv("logFormat")), filename=os.getenv("logFilename")) 

app = Flask(__name__)
api = Api(app)
api = Namespace('Posts', description='Posts Endpoint')
db = database_extensions()

databaseTableName = 'posttypes'
databaseFieldPostId = 'post_id'
databaseFieldPostName = 'post_name'
databaseFieldPostSize = 'post_size'
databaseFieldPostSizeInPixels= 'post_sizeinpixels'
databaseFieldPostPrice = 'post_price'

@api.route('/posts')
class Posts(Resource):
    def get(self):
        posts = db.fetchAll(f"SELECT * FROM {databaseTableName}")
        return posts, 200