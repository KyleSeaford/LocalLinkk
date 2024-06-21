import logging
from flask import Flask
from flask_restx import Api
from flask_cors import CORS
from endpoint_categories import api as namespaceCategories
from endpoint_categories import Categories

logging.basicConfig(level=logging.DEBUG,  # Set the logging level to DEBUG for all messages
                    format='%(asctime)s - %(levelname)s - %(message)s',
                    filename='application.log')  # Log messages to a file named example.log

app = Flask(__name__)
CORS(app)  # Allow CORS for all routes
api = Api(app, version='1.0', title='Application', description='Application Swagger')
api.add_namespace(namespaceCategories)

if __name__ == '__main__':
    logging.info("=== Application Start ===")
    try:
        Categories("categories.db")
        app.run(host='0.0.0.0', port=5500, debug=True)
    except Exception as ex:
        logging.error(f"ERROR in application: {ex}")