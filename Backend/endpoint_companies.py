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
    
@api.route('/company/<string:company_id>/details')
@api.param('company_id', 'Company id')
class GetCompany(Resource):
    def get(self,company_id):
        logging.debug(f"Getting company details for {company_id}")        
        result = db.fetchJson([databaseFieldCompanyId, databaseFieldCompanyName, databaseFieldCategoryId, databaseFieldEmail, databaseFieldPhone, databaseFieldWebsite, databaseFieldLongitude, databaseFieldLatitude], databaseTableName, f"where {databaseFieldCompanyId}='{company_id}'", '')
        if len(result) == 0:
            return {'message': f'Company {company_id} does not exists'}, 400
        return result

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
    
#TODO: POST /company
#TODO: PUT /company/{company_id}
#TODO: DELETE /company/{company_id}
#TODO: /companies/{category_id}
#TODO: /companies/{category_id}/{lat}/{long}/{radius}