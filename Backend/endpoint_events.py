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
api = Namespace('Events', description='Events Endpoint')
db = database_extensions()
databaseTableName = 'events'
databaseFieldEventId = 'event_id'
databaseFieldEventName = 'event_name'
databaseFieldCompanyId = 'company_id'
databaseFieldGenreId = 'genre_id'
databaseFieldEmail = 'email'
databaseFieldPhone = 'phone'
databaseFieldWebsite = 'website'
databaseFieldLatitude = 'latitude'
databaseFieldLongitude = 'longitude'
databaseFieldAdvertType = 'advert_type'
databaseFieldAdvertText = 'advert_text'
databaseFieldAdvertImage = 'advert_image'
databaseFieldAdvertExpires = 'advert_expires'
databaseFieldMapLink = 'google_maps_link'
databaseFieldCreatedDate = "created_date"
databaseFieldCreatedBy = "created_by_user_id"
argumentEventName = 'Event Name'
argumentCompanyName = "Company Name"
argumentGenreId = 'Genre Id'
argumentEventEmail = 'Event Email'
argumentEventPhone = 'Event Phone'
argumentEventWebsite = 'Event Website'
argumentLatitude = 'Latitude'
argumentLongitude = 'Longitude'
argumentAdvertType = 'Advert Type'
argumentAdvertText = 'Advert Text'
argumentAdvertImage = 'Advert Image'
argumentAdvertExpires = 'Advert Expiry Date'
argumentMapLink = 'Google Maps Link'
argumentUserId = "User Id"

@api.route('/events/<string:page_offset>/<string:page_limit>', doc={"description": "Get all events with pagination"})
@api.param('page_offset', 'Page Offset')
@api.param('page_limit', 'Page Limit')
class GetEventsPagination(Resource):
    def get(self, page_offset, page_limit):        
        return db.fetchJson([databaseFieldEventId, databaseFieldEventName, databaseFieldAdvertType, databaseFieldAdvertText, databaseFieldAdvertImage], databaseTableName, '', f'ORDER BY {databaseFieldCreatedDate} ASC offset {page_offset} limit {page_limit}')
