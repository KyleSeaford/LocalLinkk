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
        posts = db.fetchJson([databaseFieldPostId, databaseFieldPostName, databaseFieldPostSize, databaseFieldPostSizeInPixels, databaseFieldPostPrice],databaseTableName, " ","ORDER BY " + databaseFieldPostId)
        return posts, 200
    

@api.route('/posts/<int:post_id>')
class Post(Resource):
    def get(self, post_id):
        post = db.fetchSingleValue(f"SELECT * FROM {databaseTableName} WHERE {databaseFieldPostId} = {post_id}")
        return post, 200


@api.route('/posts/<string:post_type>/<int:duration>/cost')
class PostType(Resource):
    def get(self, post_type, duration):
        post = db.fetchSingleValue(f"SELECT {databaseFieldPostPrice} FROM {databaseTableName} WHERE {databaseFieldPostName} = '{post_type}'")
        post = post * duration

        # if the end date is the default end date, the duration is 7 days, if it is not, the duration is the difference between the chosen end date and selected end date in days 
        # so if the post is 7 days it cost £2 but if its 10 days it £2 + £0.50 for each extra day
        # if the post is 7 days the cost is £2
        # if the post is 10 days the cost is £2 + £0.50 + £0.50 + £0.50 = £3.50
        # if the post is 14 days the cost is £2 + £0.50 + £0.50 + £0.50 + £0.50 + £0.50 + £0.50 + 0.50p = £5.50
        # if the post is 21 days the cost is £2 + £0.50 + £0.50 + £0.50 + £0.50 + £0.50 + £0.50 + 0.50p + £0.50 + £0.50 + £0.50 + £0.50 + £0.50 + £0.50 + 0.50p = £8.50

        # need to use the post cost and the duration to calculate the cost
        return post, 200