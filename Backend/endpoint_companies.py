from flask_restx import Api, Namespace, Resource, reqparse
from flask import Flask
from database_extensions import database_extensions

app = Flask(__name__)
api = Api(app)
api = Namespace('Companies', description='Companies Endpoint')
db = database_extensions("")
databaseTableName = 'companies'
databaseFieldCompanyId = 'company_id'
databaseFieldCompanyName = 'company_name'
databaseFieldParentCompanyId = 'category_id'
databaseFieldEmail = 'email'
databaseFieldPhone = 'phone'
databaseFieldWebsite = 'website'
argumentCompanyName = 'Company Name'
argumentCategoryId = 'Category Id'
argumentCompanyEmail = 'Company Email'
argumentCompanyPhone = 'Company Phone'
argumentCompanyWebsite = 'Company Website'

class Companies():    
    def __init__(self, databaseName):
        global db
        db = database_extensions(databaseName)

@api.route('/categories', doc={"description": "Get all categories"})
class GetCategories(Resource):
    def get(self):        
        return db.fetchJson([databaseFieldCompanyId, databaseFieldCompanyName, argumentCategoryId], databaseTableName, '', f'ORDER BY {databaseFieldCompanyName} ASC')
    

#TODO: Create new table
#TODO: Add to application.py
#TODO: create unit test
#TODO: GET company/{company_id}/details
#TODO: POST /company
#TODO: PUT /company/{company_id}
#TODO: DELETE /company/{company_id}
#TODO: /companies/{category_id}