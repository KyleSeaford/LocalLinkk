from flask_restx import Api, Namespace, Resource, reqparse
from flask import Flask
from database_extensions import database_extensions
import logging
import os
from dotenv import load_dotenv
from datetime import date
from function_is_valid_advert import is_valid_basic_advert, is_valid_custom_advert
from function_generate_default_text_advert import *

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
databaseFieldCreatedCompanyName = 'company_name'
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
databaseFieldEventDate = "event_date"
databaseFieldRssEventId = "rss_event_id"


@api.route('/series/<int:page_offset>/<int:page_limit>', doc={"description": "Get all series with pagination"})
class GetSeriesPagination(Resource):
    def get(self, page_offset, page_limit):        
        return db.fetchJson([databaseFieldSeriesId, databaseFieldCreatedDate, databaseFieldCreatedBy, databaseFieldRecurrence], databaseTableSeries, '', f'ORDER BY {databaseFieldCreatedDate} ASC offset {page_offset} limit {page_limit}')
    
@api.route('/<int:page_offset>/<int:page_limit>', doc={"description": "Get all events with pagination"})
class GetEventsPagination(Resource):
    def get(self, page_offset, page_limit):        
        return db.fetchJson([databaseFieldEventId, databaseFieldEventName, databaseFieldAdvertType, databaseFieldAdvertText, databaseFieldAdvertImage], databaseTableEvents, '', f'ORDER BY {databaseFieldEventDate} ASC offset {page_offset} limit {page_limit}')

@api.route('/byuser/<string:user_id>/<int:page_offset>/<int:page_limit>', doc={"description": "Get all events created by user with pagination"})
class GetEventsByUserPagination(Resource):
    def get(self, user_id, page_offset, page_limit):        
        return db.fetchJson([databaseFieldEventId, databaseFieldEventName, databaseFieldAdvertType, databaseFieldAdvertText, databaseFieldAdvertImage], databaseTableEvents, f"where {databaseFieldCreatedBy} = '{user_id}'", f'ORDER BY {databaseFieldEventDate} ASC offset {page_offset} limit {page_limit}')

@api.route('/byseries/<string:series_id>/<int:page_offset>/<int:page_limit>', doc={"description": "Get all events in series with pagination"})
class GetEventsBySeriesPagination(Resource):
    def get(self, series_id, page_offset, page_limit):        
        return db.fetchJson([databaseFieldEventId, databaseFieldEventName, databaseFieldAdvertType, databaseFieldAdvertText, databaseFieldAdvertImage], databaseTableEvents, f"where {databaseFieldSeriesId} = '{series_id}'", f'ORDER BY {databaseFieldEventDate} ASC offset {page_offset} limit {page_limit}')

@api.route('/bygenre/<string:genre_id>/<string:start_date>/<string:end_date>/<string:latitude>/<string:longitude>/<int:radius>/<int:page_offset>/<int:page_limit>', doc={"description": "Get events by genre, date and location with pagination"})
class GetEventsByGenreDateAndLocation(Resource):
    def get(self, genre_id, start_date, end_date, latitude, longitude, radius, page_offset, page_limit):
        distanceSearch = f"(6371 * acos(cos(radians({latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians({longitude})) + sin(radians({latitude})) * sin(radians(latitude))))"
        distanceColumn = f"{distanceSearch} AS distance"
        where = f"where {distanceSearch} < {radius} and {databaseFieldGenreId}='{genre_id}' and {databaseFieldEventDate} between '{start_date}' and '{end_date}'"
        return db.fetchJson([databaseFieldEventId, databaseFieldEventName, databaseFieldAdvertType, databaseFieldAdvertText, databaseFieldAdvertImage], databaseTableEvents, where, f'ORDER BY {databaseFieldEventDate} ASC offset {page_offset} limit {page_limit}')

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


@api.route('/', doc={"description": "Add a new event"}) 
class PostEvent(Resource):
    parserAddEvent = reqparse.RequestParser()
    # default fields
    parserAddEvent.add_argument(databaseFieldEventName, type=str, help='Event Name', required=True)
    parserAddEvent.add_argument(databaseFieldCreatedCompanyName, type=str, help='Company Name', required=True)
    parserAddEvent.add_argument(databaseFieldEventDate, type=str, help='Event Date', required=True)
    parserAddEvent.add_argument(databaseFieldPhone, type=str, help='Phone', required=True)
    parserAddEvent.add_argument(databaseFieldAdvertText, type=str, help='Advert Text', required=True)

    parserAddEvent.add_argument(databaseFieldCreatedBy, type=str, help='User Id', required=True)
    parserAddEvent.add_argument(databaseFieldLatitude, type=str, help='Latitude', required=True)
    parserAddEvent.add_argument(databaseFieldLongitude, type=str, help='Longitude', required=True)

    parserAddEvent.add_argument(databaseFieldGenreId, type=str, help='Genre Id', required=True)

    parserAddEvent.add_argument(databaseFieldWebsite, type=str, help='Website Link', required=False)
    parserAddEvent.add_argument(databaseFieldEmail, type=str, help='Email', required=False)

    parserAddEvent.add_argument(databaseFieldAdvertType, type=str, help='Advert Type', required=False)
    parserAddEvent.add_argument(databaseFieldAdvertImage, type=str, help='Advert Image', required=False)
    parserAddEvent.add_argument(databaseFieldAdvertExpires, type=str, help='Advert Expiry Date', required=False)
    parserAddEvent.add_argument(databaseFieldCompanyId, type=str, help='Company Id', required=False)
    parserAddEvent.add_argument(databaseFieldRssEventId, type=str, help='RSS event Id', required=False)

    @api.doc(parser=parserAddEvent)
    def post(self):
        args = self.parserAddEvent.parse_args()

        # Check user id
        userId = args[databaseFieldCreatedBy]
        if db.fetchSingleValue(f"select count(*) from users where userid='{userId}'") == 0:
            return {'message': f'Invalid user id'}, 400
    
        # Check Genre id
        genreId = args[databaseFieldGenreId]
        if db.fetchSingleValue(f"select count(*) from genres where genre_id='{genreId}'") == 0:
            return {'message': f'Invalid genre id'}, 400

        # check if the phone number is valid
        phone = args[databaseFieldPhone]
        if phone != "" and phone != None:
            if is_valid_uk_phone_number(phone) == False:
                return {'message': f'Invalid phone number'}, 400

        # Get event name
        eventName = args[databaseFieldEventName]

        # Get company name
        companyName = args[databaseFieldCreatedCompanyName]

        # Get event date
        eventDate = args[databaseFieldEventDate]

        # set the advert text
        advertText = args[databaseFieldAdvertText]

        # set the phone number
        phoneNumber = args[databaseFieldPhone]

        # set the advert link
        advertLink = args[databaseFieldWebsite]

        # set the email
        email = args[databaseFieldEmail]

        # set the advert type        
        advertType = args[databaseFieldAdvertType]
        if advertType == "" or advertType == None:
            advertType = "Text"

        # set the advert expiry date
        advertDate = args[databaseFieldAdvertExpires]
        if advertDate == "" or advertDate == None:
            advertDate = "31/12/9999"

        if advertType == "TextCustom":
            advertDate = "11/11/1111"

        # Check advert type is valid
        advertTypes = ["Text", "TextCustom", "ImageSmall", "ImageMedium", "ImageLarge", "ImageCustom"]
        if advertType not in advertTypes:
            return {'message': f'Invalid advert type: {advertType}, valid types are {", ".join(advertTypes)}'}, 400
        
        # if the advert type is basic generate a default advert
        if advertType == "Text":
            advertText = generateDefaultEventAdvert(eventName, companyName, eventDate, phoneNumber, advertText)

        # if the advert type is custom and the text is empty or None, generate a custom advert
        if advertType == "TextCustom" and (advertText != "" or advertText != None):
            advertText = generateTextEventAdvert(eventName, companyName, eventDate, advertText, phoneNumber, email, advertLink)

        # check if the advert text is valid
        if advertType == "Text":
            basicValidationIssues = is_valid_basic_advert(advertText)            
            if basicValidationIssues != None and len(basicValidationIssues) > 0:
                return {'message': f'Invalid advert text because {", ".join(basicValidationIssues)}'}, 400
            
        if advertType == "TextCustom":
            customValidationIssues = is_valid_custom_advert(advertText)            
            if customValidationIssues != None and len(customValidationIssues) > 0:
                return {'message': f'Invalid advert text because {", ".join(customValidationIssues)}'}, 400

        # Generate auto populated fields
        eventId = db.generateId()
        createdDate = date.today()

        # Insert the new event
        sql = f"INSERT INTO {databaseTableEvents} "
        sql += f"({databaseFieldEventId}, {databaseFieldCreatedBy}, {databaseFieldCreatedDate}, {databaseFieldEventName}, {databaseFieldLatitude}, {databaseFieldLongitude}, {databaseFieldEventDate}, {databaseFieldGenreId}, {databaseFieldAdvertType}, {databaseFieldAdvertText}, {databaseFieldAdvertImage}, {databaseFieldAdvertExpires}, {databaseFieldCompanyId}, {databaseFieldRssEventId})"
        sql += " VALUES "
        sql += f"('{eventId}','{userId}','{createdDate}','{db.makeSafe(eventName)}', {args[databaseFieldLatitude]}, {args[databaseFieldLongitude]}, '{db.makeSafe(eventDate)}','{genreId}', '{advertType}', '{db.makeSafe(advertText)}', '{args[databaseFieldAdvertImage]}', '{advertDate}', '{args[databaseFieldCompanyId]}', '{args[databaseFieldRssEventId]}')"
        db.execute(sql) 
        return {'message': 'Event added successfully', 'event_id':eventId}, 201


@api.route('/<event_id>/advertPreview')
@api.param('event_id', 'Event id')
class GetAdvertPreview(Resource):
    def get(self, event_id):
        logging.debug(f"Getting advert preview for {event_id}")        
        result = db.fetchJson([databaseFieldAdvertText], databaseTableEvents, f"where {databaseFieldEventId}='{event_id}'", '')
        if len(result) == 0:
            return {'message': f'Event {event_id} does not exists'}, 400
        return result[0]
    
@api.route('/<event_id>/PostType')
@api.param('event_id', 'Event id')
class GetCompanyAdvertType(Resource):
    def get(self,event_id):
        try:
            logging.debug(f"Getting advert type for {event_id}")        
            result = db.fetchSingleValue(f"SELECT {databaseFieldAdvertType} FROM {databaseTableEvents} WHERE {databaseFieldEventId}='{event_id}'")
            if result == "Text":
                return {'message': 'Text Post'}, 200

            elif result == "TextCustom":
                return {'message': 'Text Post With Web Link'}, 200

            elif result == "ImageSmall":
                return {'message': 'Small Image - Coming soon!'}, 200

            elif result == "ImageMedium":
                return {'message': 'Medium Image - Coming soon!'}, 200

            elif result == "ImageLarge":
                return {'message': 'Large Image - Coming soon!'}, 200

            elif result == "ImageCustom":
                return {'message': 'Custom Design - Coming soon!'}, 200
            
        except Exception as e:
            return {'message': 'Error occurred while fetching advert type'}, 500


