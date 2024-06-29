import logging
from flask import Flask
from flask_restx import Api
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from endpoint_categories import api as namespaceCategories
from endpoint_categories import Categories
from endpoint_companies import api as namespaceCompanies
from endpoint_users import api as namespaceUsers
import os
from dotenv import load_dotenv

load_dotenv()
logging.basicConfig(level=os.getenv("logLevel"), format=str(os.getenv("logFormat")), filename=os.getenv("logFilename")) 

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY') # make sure to change this in .env file
jwt = JWTManager(app) 
CORS(app)  # Allow CORS for all routes

api = Api(app, version='1.0', title='Application', description='Application Swagger\n Database Type: ' + str(os.getenv("dbType")))

api.add_namespace(namespaceCategories)
api.add_namespace(namespaceCompanies)
api.add_namespace(namespaceUsers)

if __name__ == '__main__':
    logging.info("=== Application Start ===")
    try:
        Categories(os.getenv("databaseFilename"))
        app.run(host='0.0.0.0', port=5500, debug=True)
    except Exception as ex:
        logging.error(f"ERROR in application: {ex}")