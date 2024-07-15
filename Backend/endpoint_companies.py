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
api = Namespace('Companies', description='Companies Endpoint')
db = database_extensions()
databaseTableName = 'companies'
databaseFieldCompanyId = 'company_id'
databaseFieldCompanyName = 'company_name'
databaseFieldCategoryId = 'category_id'
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
argumentCompanyName = 'Company Name'
argumentCategoryId = 'Category Id'
argumentCompanyEmail = 'Company Email'
argumentCompanyPhone = 'Company Phone'
argumentCompanyWebsite = 'Company Website'
argumentLatitude = 'Latitude'
argumentLongitude = 'Longitude'
argumentAdvertType = 'Advert Type'
argumentAdvertText = 'Advert Text'
argumentAdvertImage = 'Advert Image'
argumentAdvertExpires = 'Advert Expiry Date'
argumentMapLink = 'Google Maps Link'
argumentUserId = "User Id"

@api.route('/companies', doc={"description": "Get all companies"})
class GetCompanies(Resource):
    def get(self):        
        return db.fetchJson([databaseFieldCompanyId, databaseFieldCompanyName, databaseFieldCategoryId, databaseFieldAdvertType, databaseFieldAdvertText, databaseFieldAdvertImage], databaseTableName, '', f'ORDER BY {databaseFieldCompanyName} ASC')

@api.route('/companies/<string:category_id>')
@api.param('category_id', 'Category id')
class GetCompaniesByCategory(Resource):
    def get(self,category_id):
        logging.debug(f"Getting companies by category id")        
        return db.fetchJson([databaseFieldCompanyId, databaseFieldCompanyName, databaseFieldCategoryId, databaseFieldAdvertType, databaseFieldAdvertText, databaseFieldAdvertImage], databaseTableName, f"where {databaseFieldCategoryId}='{category_id}'", '')

@api.route('/companies/<string:category_id>/<string:latitude>/<string:longitude>/<string:radius>')
@api.param('category_id', 'Category id')
@api.param('longitude', 'Longitude')
@api.param('latitude', 'Latitude')
@api.param('radius', 'Maximum Distance')
class GetCompaniesByCategoryAndLocation(Resource):
    def get(self,category_id, latitude, longitude, radius):
        logging.debug(f"Getting companies by category id and location")   
        distanceSearch = f"(6371 * acos(cos(radians({latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians({longitude})) + sin(radians({latitude})) * sin(radians(latitude))))"
        distanceColumn = f"{distanceSearch} AS distance"
        where = f"where {distanceSearch} < {radius} and {databaseFieldCategoryId}='{category_id}'"
        return db.fetchJson([databaseFieldCompanyId, databaseFieldCompanyName, databaseFieldCategoryId, "latitude", "longitude", distanceColumn, databaseFieldAdvertType, databaseFieldAdvertText, databaseFieldAdvertImage], databaseTableName, where, "ORDER BY distance")

@api.route('/companies/user/<string:user_id>')
@api.param(argumentUserId, 'User id')
class GetCompaniesByUser(Resource):
    def get(self,user_id):
        logging.debug(f"Getting companies created by user id")        
        return db.fetchJson([databaseFieldCompanyId, databaseFieldCompanyName, databaseFieldCategoryId, databaseFieldAdvertType, databaseFieldAdvertText, databaseFieldAdvertImage], databaseTableName, f"where {databaseFieldCreatedBy}='{user_id}'", '')

@api.route('/company/<string:company_id>/details')
@api.param('company_id', 'Company id')
class GetCompany(Resource):
    def get(self,company_id):
        logging.debug(f"Getting company details for {company_id}")        
        result = db.fetchJson([databaseFieldCompanyId, databaseFieldCompanyName, databaseFieldCategoryId, databaseFieldEmail, databaseFieldPhone, databaseFieldWebsite, databaseFieldLongitude, databaseFieldLatitude, databaseFieldCreatedBy, databaseFieldCreatedDate], databaseTableName, f"where {databaseFieldCompanyId}='{company_id}'", '')
        if len(result) == 0:
            return {'message': f'Company {company_id} does not exists'}, 400
        return result[0]

@api.route('/company', doc={"description": "Add a new company"}) 
class PostCompany(Resource):
    parserAdd = reqparse.RequestParser()
    parserAdd.add_argument(argumentCompanyName, type=str, help='Company Name', required=True)
    parserAdd.add_argument(argumentCategoryId, type=str, help='Category Id', required=True)
    parserAdd.add_argument(argumentLatitude, type=str, help='Latitude', required=True)
    parserAdd.add_argument(argumentLongitude, type=str, help='Longitude', required=True)
    parserAdd.add_argument(argumentCompanyEmail, type=str, help='Email', required=False)
    parserAdd.add_argument(argumentCompanyPhone, type=str, help='Phone', required=False)
    parserAdd.add_argument(argumentMapLink, type=str, help='Google maps link', required=False)
    parserAdd.add_argument(argumentCompanyWebsite, type=str, help='Website', required=False)
    parserAdd.add_argument(argumentAdvertType, type=str, help='Advert Type', required=False)
    parserAdd.add_argument(argumentAdvertText, type=str, help='Advert Text', required=False)
    parserAdd.add_argument(argumentAdvertImage, type=str, help='Advert Image', required=False)
    parserAdd.add_argument(argumentUserId, type=str, help='Id of the user', required=False)

    @api.doc(parser=parserAdd)
    def post(self):
        args = self.parserAdd.parse_args()
        companyName = args[argumentCompanyName]
        categoryId = args[argumentCategoryId]
        
        # Check if the company already exists
        recordExists = db.fetchSingleValue(f"SELECT COUNT(*) FROM {databaseTableName} WHERE {databaseFieldCompanyName}='{companyName}' and {databaseFieldCompanyId}='{categoryId}'")
        if recordExists > 0:
            return {'message': f'company {companyName} already exists'}, 400

        # check if the phone number is valid
        phone = args[argumentCompanyPhone]
        if phone != "" and phone != None:
            if is_valid_uk_phone_number(phone) == False:
                return {'message': f'Invalid phone number'}, 400

        # set the advert text
        advertText = args[argumentAdvertText]
        # set the advert link
        advertLink = args[argumentCompanyWebsite]

        # set the advert type        
        advertType = args[argumentAdvertType]
        if advertType == "" or advertType == None:
            advertType = "Text"
        
        # Check advert type is valid
        advertTypes = ["Text", "TextCustom", "ImageSmall", "ImageMedium", "ImageLarge"]
        if advertType not in advertTypes:
            return {'message': f'Invalid advert type: {advertType}, valid types are {", ".join(advertTypes)}'}, 400
        
        # if the advert type is basic and the text is empty or None, generate a default advert
        if advertType == "Text" and (advertText == "" or advertText == None):
            city = "" 
            advertText = generateDefaultTextAdvert(companyName, city, phone)

        # if the advert type is custom and the text is empty or None, generate a custom advert
        if advertType == "TextCustom" and (advertText != "" or advertText != None):
            advertText = generateTextAdvert(companyName, advertText, advertLink)

        # check if the advert text is valid
        if advertType == "Text":
            basicValidationIssues = is_valid_basic_advert(advertText)            
            if basicValidationIssues != None and len(basicValidationIssues) > 0:
                return {'message': f'Invalid advert text because {", ".join(basicValidationIssues)}'}, 400
            
        if advertType == "TextCustom":
            customValidationIssues = is_valid_custom_advert(advertText)            
            if customValidationIssues != None and len(customValidationIssues) > 0:
                return {'message': f'Invalid advert text because {", ".join(customValidationIssues)}'}, 400

        # set the advert image
        mapLink = args[argumentMapLink]
        if mapLink == "" or mapLink == None:
            mapLink = " "

        # generate a new company id
        newCompanyId = db.generateId()
        createdDate = date.today()

        # add the company to the database
        db.execute(f"INSERT INTO {databaseTableName} ({databaseFieldCompanyId}, {databaseFieldCompanyName}, {databaseFieldCategoryId}, {databaseFieldLatitude}, {databaseFieldLongitude}, {databaseFieldEmail}, {databaseFieldPhone}, {databaseFieldWebsite}, {databaseFieldAdvertType}, {databaseFieldAdvertText}, {databaseFieldAdvertImage}, {databaseFieldMapLink}, {databaseFieldCreatedBy}, {databaseFieldCreatedDate}) VALUES ('{newCompanyId}', '{companyName}', '{categoryId}', '{args[argumentLatitude]}','{args[argumentLongitude]}','{args[argumentCompanyEmail]}','{phone}','{args[argumentCompanyWebsite]}','{advertType}','{advertText}','{args[argumentAdvertImage]}','{args[argumentMapLink]}', '{args[argumentUserId]}', '{createdDate}')") 
        return {'message': 'Company added successfully', 'company_id':newCompanyId, 'advertText':advertText}, 201

@api.route('/company/<company_id>')
class PutCompany(Resource):
    parserUpdate = reqparse.RequestParser()
    parserUpdate.add_argument(argumentCompanyName, type=str, help='Company Name', required=False)
    parserUpdate.add_argument(argumentCategoryId, type=str, help='Category Id', required=False)
    parserUpdate.add_argument(argumentLatitude, type=str, help='Latitude', required=False)
    parserUpdate.add_argument(argumentLongitude, type=str, help='Longitude', required=False)
    parserUpdate.add_argument(argumentCompanyEmail, type=str, help='Email', required=False)
    parserUpdate.add_argument(argumentCompanyPhone, type=str, help='Phone', required=False)
    parserUpdate.add_argument(argumentMapLink, type=str, help='Google maps link', required=False)
    parserUpdate.add_argument(argumentCompanyWebsite, type=str, help='Website', required=False)
    parserUpdate.add_argument(argumentAdvertType, type=str, help='Advert Type', required=False)
    parserUpdate.add_argument(argumentAdvertText, type=str, help='Advert Text', required=False)
    parserUpdate.add_argument(argumentAdvertImage, type=str, help='Advert Image', required=False)
    parserUpdate.add_argument(argumentAdvertExpires, type=str, help='Advert Expiry Date', required=False)
    
    @api.doc(parser=parserUpdate)
    @api.doc(description="Update an existing company")
    def put(self, company_id):
        args = self.parserUpdate.parse_args()
        # Mapping argument names to database field names
        field_mapping = {
            argumentCompanyName: databaseFieldCompanyName,
            argumentCategoryId: databaseFieldCategoryId,
            argumentLatitude: databaseFieldLatitude,
            argumentLongitude: databaseFieldLongitude,
            argumentCompanyEmail: databaseFieldEmail,
            argumentCompanyPhone: databaseFieldPhone,
            argumentCompanyWebsite: databaseFieldWebsite,
            argumentAdvertType:databaseFieldAdvertType,
            argumentAdvertText:databaseFieldAdvertText,
            argumentAdvertImage: databaseFieldAdvertImage,
            argumentAdvertExpires: databaseFieldAdvertExpires,
            argumentMapLink: databaseFieldMapLink
        }
        
        update_fields = {field_mapping[arg]: value for arg, value in args.items() if value is not None}
        
        if not update_fields:
            return {'message': 'No data provided to update'}, 400 
        
        #todo add advert text validation

        # Update the company details
        update_set = ", ".join([f"{key}='{value}'" for key, value in update_fields.items()])
        db.execute(f"UPDATE {databaseTableName} SET {update_set} WHERE {databaseFieldCompanyId}='{company_id}'")
        
        return {'message': 'Company updated successfully'}, 200

    @api.doc(description="Delete an existing company")
    def delete(self, company_id):
        # Check if the company exists
        recordExists = db.fetchSingleValue(f"SELECT COUNT(*) FROM {databaseTableName} WHERE {databaseFieldCompanyId}='{company_id}'")
        if recordExists == 0:
            return {'message': f'Company {company_id} does not exist'}, 404
        
        # Delete the company
        db.execute(f"DELETE FROM {databaseTableName} WHERE {databaseFieldCompanyId}='{company_id}'")
        return {'message': 'Company deleted successfully'}, 200
    
@api.route('/company/<company_id>/advertPreview')
@api.param('company_id', 'Company id')
class GetAdvertPreview(Resource):
    def get(self,company_id):
        logging.debug(f"Getting advert preview for {company_id}")        
        result = db.fetchJson([databaseFieldAdvertText], databaseTableName, f"where {databaseFieldCompanyId}='{company_id}'", '')
        if len(result) == 0:
            return {'message': f'Company {company_id} does not exists'}, 400
        return result[0]