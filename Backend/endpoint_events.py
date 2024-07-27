from flask_restx import Api, Namespace, Resource, reqparse
from flask import Flask
from database_extensions import database_extensions
import logging
import os
from dotenv import load_dotenv
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

@api.route('/series', doc={"description": "Add a new event series"}) 
class PostSeries(Resource):
    parserAdd = reqparse.RequestParser()
    parserAdd.add_argument(databaseFieldCreatedBy, type=str, help='User Id', required=True)
    parserAdd.add_argument(databaseFieldRecurrence, type=str, help='Event Recurrence', required=True)

    @api.doc(parser=parserAdd)
    def post(self):
        args = self.parserAdd.parse_args()

        # Check user id
        userId = args[databaseFieldCreatedBy]
        if db.fetchSingleValue(f"select count(*) from users where userid='{userId}'") == 0:
            return {'message': f'Invalid user id'}, 400
        
        # Check recurrence
        recurrence = args[databaseFieldRecurrence]
        recurrenceTypes = [
            'daily', 
            'weekly on monday', 'weekly on tuesday', 'weekly on wednesday', 'weekly on thursday', 'weekly on friday', 'weekly on saturday', 'weekly on sunday', 
            'monthly first monday', 'monthly first tuesday',
            'monthly last monday', 'monthly last tuesday', 
        ]
        if recurrence not in recurrenceTypes:
            return {'message': f'Invalid recurrence type: {recurrence}, valid types are {", ".join(recurrenceTypes)}'}, 400
        
        # Generate auto populated fields
        seriesId = db.generateId()
        createdDate = date.today()

        # Insert the new series
        db.execute(f"INSERT INTO {databaseTableSeries} ({databaseFieldSeriesId}, {databaseFieldCreatedBy}, {databaseFieldCreatedDate}, {databaseFieldRecurrence}) values ('{seriesId}','{userId}','{createdDate}','{recurrence}')")
        return {'message': 'Series added successfully', 'series_id':seriesId}, 201



# todo post event
# todo get events by user
# todo get events in series
# todo get events by cat log lat 