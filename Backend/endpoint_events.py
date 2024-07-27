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
databaseTableEvents = 'events'
databaseTableSeries = 'series'
databaseFieldEventId = 'event_id'
databaseFieldSeriesId = 'series_id'
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
databaseFieldRecurrence = "recurrence"
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

@api.route('/', defaults={'page_offset':'0', 'page_limit': '100'})
@api.route('/<int:page_offset>/<int:page_limit>', doc={"description": "Get all events with pagination"})
class GetEventsPagination(Resource):
    def get(self, page_offset, page_limit):        
        return db.fetchJson([databaseFieldEventId, databaseFieldEventName, databaseFieldAdvertType, databaseFieldAdvertText, databaseFieldAdvertImage], databaseTableEvents, '', f'ORDER BY {databaseFieldCreatedDate} ASC offset {page_offset} limit {page_limit}')

@api.route('/series', defaults={'page_offset':'0', 'page_limit': '100'})
@api.route('/series/<int:page_offset>/<int:page_limit>', doc={"description": "Get all series with pagination"})
class GetSeriesPagination(Resource):
    def get(self, page_offset, page_limit):        
        return db.fetchJson([databaseFieldSeriesId, databaseFieldCreatedDate, databaseFieldCreatedBy, databaseFieldRecurrence], databaseTableSeries, '', f'ORDER BY {databaseFieldCreatedDate} ASC offset {page_offset} limit {page_limit}')


# todo get events by cat log lat 
# todo get events by user
# todo get events in series
# todo post event
# todo post series

