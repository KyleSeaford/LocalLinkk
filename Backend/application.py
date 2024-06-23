import logging
from flask import Flask
from flask_restx import Api
from flask_cors import CORS
from endpoint_categories import api as namespaceCategories
from endpoint_categories import Categories
from endpoint_companies import api as namespaceCompanies
import os
from dotenv import load_dotenv

load_dotenv()
logging.basicConfig(level=os.getenv("logLevel"), format=str(os.getenv("logFormat")), filename=os.getenv("logFilename")) 

app = Flask(__name__)
CORS(app)  # Allow CORS for all routes
api = Api(app, version='1.0', title='Application', description='Application Swagger')
api.add_namespace(namespaceCategories)
api.add_namespace(namespaceCompanies)

if __name__ == '__main__':
    logging.info("=== Application Start ===")
    try:
        Categories(os.getenv("databaseFilename"))
        app.run(host='0.0.0.0', port=5500, debug=True)
    except Exception as ex:
        logging.error(f"ERROR in application: {ex}")