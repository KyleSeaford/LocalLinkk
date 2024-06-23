import unittest
import json
import os
import sqlite3
import tempfile
from flask import Flask
from flask_cors import CORS
from flask_restx import Api
from endpoint_companies import *


class endpoint_companies_tests(unittest.TestCase):
    def setUp(self):
        global api, db
        """Set up for unit tests, function is executed before tests begin"""

        # Create a temporary file to use as a test database
        self.db_fd, self.db_path = tempfile.mkstemp()

        # Initialize the database with the test schema and data
        self.init_db()

        # Override the database path in the Categories class
        #db = database_extensions(self.db_path)
        Companies(self.db_path)

        # Create the Flask test client
        self.app = Flask(__name__)
        CORS(self.app)  # Allow CORS for all routes
        self.api = Api(self.app, version='1.0', title='PI Firmware', description='Pi Side Firmware Controller')
        self.api.add_namespace(api, path='/')
        self.client = self.app.test_client()
        self.app.config['TESTING'] = True
           
    def tearDown(self):
        """Tear down for unit tests, function is executed after tests have been executed"""

        # Close and remove the temporary database
        os.close(self.db_fd)
        os.unlink(self.db_path)

    def init_db(self):
        """Initialize the database with the test schema and data"""

        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('CREATE TABLE "companies" (`company_id` guid PRIMARY KEY, `company_name`, `category_id` guid,`email` varchar(255),`phone` varchar(15),`website` varchar(255),latitude DOUBLE PRECISION NOT NULL,longitude DOUBLE PRECISION NOT NULL)')
        cursor.execute('INSERT INTO companies (company_id, company_name, category_id,latitude,longitude) VALUES (?, ?, ?, ?, ?)', ('04030201-0605-0807-0910-111213141511', 'bollington', '04030201-0605-0807-0910-111213141520', 53.293571, -2.110140))
        cursor.execute('INSERT INTO companies (company_id, company_name, category_id,latitude,longitude) VALUES (?, ?, ?, ?, ?)', ('04030201-0605-0807-0910-111213141512', 'mansfield', '04030201-0605-0807-0910-111213141530',53.143871, -1.199110))
        conn.commit()
        conn.close()

    def test_get_companies(self):
        """Test confirms that GET /companies will return a list of all the companies"""

        # Arrange 
        expected_result = [
            {'company_id': '04030201-0605-0807-0910-111213141511', 'company_name': 'bollington', 'category_id': '04030201-0605-0807-0910-111213141520'},
            {'company_id': '04030201-0605-0807-0910-111213141512', 'company_name': 'mansfield', 'category_id': '04030201-0605-0807-0910-111213141530'}
        ]

        # Act
        response = self.client.get('/companies') # Make a GET request to the companies endpoint

        # Assert
        self.assertEqual(response.status_code, 200) # Check that the response status code is 200 OK
        actual_result = json.loads(response.data) # Parse the JSON response        
        self.assertEqual(actual_result, expected_result) # Check that the response contains the expected data

    def test_get_company(self):
        """Test confirms that GET /company will return a company details"""

        # Arrange 
        expected_result = [
            {'company_id': '04030201-0605-0807-0910-111213141511', 'company_name': 'bollington', 'category_id': '04030201-0605-0807-0910-111213141520','email':None,'latitude':53.293571,'longitude':-2.11014,'phone':None,'website':None}
        ]

        # Act
        response = self.client.get('/company/04030201-0605-0807-0910-111213141511/details') # Make a GET request to the company endpoint

        # Assert
        self.assertEqual(response.status_code, 200) # Check that the response status code is 200 OK
        actual_result = json.loads(response.data) # Parse the JSON response        
        self.assertEqual(actual_result, expected_result) # Check that the response contains the expected data        

if __name__ == '__main__':
    unittest.main()