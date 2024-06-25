from flask_restx import Api, Namespace, Resource, reqparse
from flask import Flask
from database_extensions import database_extensions
import logging
import os
from dotenv import load_dotenv

load_dotenv()
logging.basicConfig(level=os.getenv("logLevel"), format=str(os.getenv("logFormat")), filename=os.getenv("logFilename")) 

app = Flask(__name__)
api = Api(app)
api = Namespace('Companies', description='Companies Endpoint')
db = database_extensions(os.getenv("databaseFilename"))
databaseTableName = 'companies'
databaseFieldCompanyId = 'company_id'
databaseFieldCompanyName = 'company_name'
databaseFieldCategoryId = 'category_id'
databaseFieldEmail = 'email'
databaseFieldPhone = 'phone'
databaseFieldWebsite = 'website'
databaseFieldLatitude = 'latitude'
databaseFieldLongitude = 'longitude'
argumentCompanyName = 'Company Name'
argumentCategoryId = 'Category Id'
argumentCompanyEmail = 'Company Email'
argumentCompanyPhone = 'Company Phone'
argumentCompanyWebsite = 'Company Website'
argumentLatitude = 'Latitude'
argumentLongitude = 'Longitude'

class Companies():    
    def __init__(self, databaseName):
        global db
        db = database_extensions(databaseName)

@api.route('/companies', doc={"description": "Get all companies"})
class GetCompanies(Resource):
    def get(self):        
        return db.fetchJson([databaseFieldCompanyId, databaseFieldCompanyName, databaseFieldCategoryId], databaseTableName, '', f'ORDER BY {databaseFieldCompanyName} ASC')

@api.route('/companies/<string:category_id>')
@api.param('category_id', 'Category id')
class GetCompaniesByCategory(Resource):
    def get(self,category_id):
        logging.debug(f"Getting companies by category id")        
        return db.fetchJson([databaseFieldCompanyId, databaseFieldCompanyName, databaseFieldCategoryId], databaseTableName, f"where {databaseFieldCategoryId}='{category_id}'", '')

@api.route('/companies/<string:category_id>/<string:latitude>/<string:longitude>/<string:radius>')
@api.param('category_id', 'Category id')
@api.param('longitude', 'Longitude')
@api.param('latitude', 'Latitude')
@api.param('radius', 'Maximum Distance')
class GetCompaniesByCategoryAndLocation(Resource):
    def get(self,category_id, latitude, longitude, radius):
        logging.debug(f"Getting companies by category id and location")  

        #query = f"SELECT {databaseFieldCompanyId}, {databaseFieldCompanyName}, latitude, longitude, (6371 * acos(cos(radians({latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians({longitude})) + sin(radians({latitude})) * sin(radians(latitude)))) AS distance FROM {databaseTableName} where distance < {radius} ORDER BY distance"
        #return db.fetchAll(query)
        #TODO create unit tests
        #TODO return result as json
        #TODO add {databaseFieldCategoryId}='{category_id}'        
        distance = f"(6371 * acos(cos(radians({latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians({longitude})) + sin(radians({latitude})) * sin(radians(latitude)))) AS distance"
        return db.fetchJson([databaseFieldCompanyId, databaseFieldCompanyName, databaseFieldCategoryId, "latitude", "longitude", distance], databaseTableName, f"where distance < {radius}", "ORDER BY distance")
        

@api.route('/company/<string:company_id>/details')
@api.param('company_id', 'Company id')
class GetCompany(Resource):
    def get(self,company_id):
        logging.debug(f"Getting company details for {company_id}")        
        result = db.fetchJson([databaseFieldCompanyId, databaseFieldCompanyName, databaseFieldCategoryId, databaseFieldEmail, databaseFieldPhone, databaseFieldWebsite, databaseFieldLongitude, databaseFieldLatitude], databaseTableName, f"where {databaseFieldCompanyId}='{company_id}'", '')
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
    parserAdd.add_argument(argumentCompanyWebsite, type=str, help='Website', required=False)
    @api.doc(parser=parserAdd)
    def post(self):
        args = self.parserAdd.parse_args()
        companyName = args[argumentCompanyName]
        categoryId = args[argumentCategoryId]
        
        # Check if the company already exists
        recordExists = db.fetchSingleValue(f"SELECT COUNT(*) FROM {databaseTableName} WHERE {databaseFieldCompanyName}='{companyName}' and {databaseFieldCompanyId}='{categoryId}'")
        if recordExists > 0:
            return {'message': f'company {companyName} already exists'}, 400
        
        # Check the category exists
        #recordExists = db.fetchSingleValue(f"SELECT COUNT(*) FROM categories WHERE category_id='{categoryId}'")
        #if recordExists != 1:
        #    return {'message': f'Category {categoryId} does not exists'}, 400

        newCompanyId = db.generateId()
        db.execute(f"INSERT INTO {databaseTableName} ({databaseFieldCompanyId}, {databaseFieldCompanyName}, {databaseFieldCategoryId}, {databaseFieldLatitude}, {databaseFieldLongitude}, {databaseFieldEmail}, {databaseFieldPhone}, {databaseFieldWebsite}) VALUES ('{newCompanyId}', '{companyName}', '{categoryId}', '{args[argumentLatitude]}','{args[argumentLongitude]}','{args[argumentCompanyEmail]}','{args[argumentCompanyPhone]}','{args[argumentCompanyWebsite]}')") 
        return {'message': 'Company added successfully', 'company_id':newCompanyId}, 201

    @api.route('/company/<company_id>')
    class PutCompany(Resource):
        parserUpdate = reqparse.RequestParser()
        parserUpdate.add_argument(argumentCompanyName, type=str, help='Company Name', required=False)
        parserUpdate.add_argument(argumentCategoryId, type=str, help='Category Id', required=False)
        parserUpdate.add_argument(argumentLatitude, type=str, help='Latitude', required=False)
        parserUpdate.add_argument(argumentLongitude, type=str, help='Longitude', required=False)
        parserUpdate.add_argument(argumentCompanyEmail, type=str, help='Email', required=False)
        parserUpdate.add_argument(argumentCompanyPhone, type=str, help='Phone', required=False)
        parserUpdate.add_argument(argumentCompanyWebsite, type=str, help='Website', required=False)
        
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
                argumentCompanyWebsite: databaseFieldWebsite
            }
            
            update_fields = {field_mapping[arg]: value for arg, value in args.items() if value is not None}
            
            if not update_fields:
                return {'message': 'No data provided to update'}, 400
            
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