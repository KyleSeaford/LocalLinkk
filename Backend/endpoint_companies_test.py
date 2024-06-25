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
    
    def test_get_companies_by_category(self):
        """Test confirms that GET /companies/<category_id> will return a list of all the companies within a category"""

        # Arrange 
        expected_result = [
            {'company_id': '04030201-0605-0807-0910-111213141512', 'company_name': 'mansfield', 'category_id': '04030201-0605-0807-0910-111213141530'}
        ]

        # Act
        response = self.client.get('/companies/04030201-0605-0807-0910-111213141530') # Make a GET request to the companies endpoint

        # Assert
        self.assertEqual(response.status_code, 200) # Check that the response status code is 200 OK
        actual_result = json.loads(response.data) # Parse the JSON response        
        self.assertEqual(actual_result, expected_result) # Check that the response contains the expected data

    def test_get_companies_by_distance16(self):
        """Test confirms that GET /companies will return a list of all the companies by distance """
        # - Log and Lat
        # Macclesfield = 53.260841, -2.128190
        # Bollington = 53.293571, -2.110140
        # Mansfield = 53.143871, -1.199110

        # Arrange 
        expectedName = "bollington"
        expectedCompanyId = '04030201-0605-0807-0910-111213141511'

        # Act
        response = self.client.get('/companies/04030201-0605-0807-0910-111213141530/53.260841/-2.128190/16') # Make a GET request to the companies endpoint

        # Assert
        self.assertEqual(response.status_code, 200) # Check that the response status code is 200 OK
        actual_result = json.loads(response.data) # Parse the JSON response        
        self.assertEqual(1, len(actual_result)) # Confirm the number of results
        self.assertEqual(expectedName, actual_result[0]['company_name']) 
        self.assertEqual(expectedCompanyId, actual_result[0]['company_id']) 
    
    def test_get_companies_by_distance100(self):
        """Test confirms that GET /companies will return a list of all the companies by distance """
        # - Log and Lat
        # Macclesfield = 53.260841, -2.128190
        # Bollington = 53.293571, -2.110140
        # Mansfield = 53.143871, -1.199110

        # Arrange 
        expectedName = "bollington"
        expectedCompanyId = '04030201-0605-0807-0910-111213141511'

        # Act
        response = self.client.get('/companies/04030201-0605-0807-0910-111213141530/53.260841/-2.128190/100') # Make a GET request to the companies endpoint

        # Assert
        self.assertEqual(response.status_code, 200) # Check that the response status code is 200 OK
        actual_result = json.loads(response.data) # Parse the JSON response        
        self.assertEqual(2, len(actual_result)) # Confirm the number of results
        self.assertEqual(expectedName, actual_result[0]['company_name']) 
        self.assertEqual(expectedCompanyId, actual_result[0]['company_id']) 

    def test_get_company(self):
        """Test confirms that GET /company/<company_id>/details will return a company details"""

        # Arrange 
        expected_result = {'company_id': '04030201-0605-0807-0910-111213141511', 'company_name': 'bollington', 'category_id': '04030201-0605-0807-0910-111213141520','email':None,'latitude':53.293571,'longitude':-2.11014,'phone':None,'website':None}        

        # Act
        response = self.client.get('/company/04030201-0605-0807-0910-111213141511/details') # Make a GET request to the company endpoint

        # Assert
        print(response)
        self.assertEqual(response.status_code, 200) # Check that the response status code is 200 OK
        actual_result = json.loads(response.data) # Parse the JSON response        
        self.assertEqual(actual_result, expected_result) # Check that the response contains the expected data        

    def test_get_company_bad_company_id(self):
        """Test confirms that GET /company/<company_id>/details will return an error when the company id does not exist"""

        # Arrange 
        companyId = 'bad'
        expected_message = 'Company bad does not exists'
        
        # Act
        response = self.client.get(f'/company/{companyId}/details') # Make a GET request to the endpoint

        # Assert
        self.assertEqual(response.status_code, 400) # Check that the response status code is 400 BAD
        self.assertEqual(response.status, '400 BAD REQUEST') # Check the response status message        
        response_json = response.get_json() # Extract the JSON data from the response    
        self.assertIn('message', response_json) # Ensure the 'message' key is in the response
        self.assertEqual(response_json['message'], expected_message) # Check that the response message contains the expected message
    
    def test_post_company(self):
        """Test confirms that POST /company will add a new company"""

        # Arrange 
        expectedCompanyName = 'zcomp1'
        expectedCategoryId = '04030201-0605-0807-0910-111213141530'
        expectedLatitude = '1'
        expectedLongitude = '2'
        expected_results = [
            {'company_id': '04030201-0605-0807-0910-111213141511', 'company_name': 'bollington', 'category_id': '04030201-0605-0807-0910-111213141520'},
            {'company_id': '04030201-0605-0807-0910-111213141512', 'company_name': 'mansfield', 'category_id': '04030201-0605-0807-0910-111213141530'},
            {'company_id': '04030201-0605-0807-0910-111213141512', 'company_name': expectedCompanyName, 'category_id': expectedCategoryId, 'Latitude': expectedLatitude, 'Longitude':expectedLongitude}
        ]        
        expected_message = 'Company added successfully'

        # Act
        response = self.client.post('/company', json={'Company Name':expectedCompanyName, 'Category Id':expectedCategoryId, 'Latitude': expectedLatitude, 'Longitude':expectedLongitude})

        # Assert
        self.assertEqual(response.status_code, 201) # Check that the response status code is 201 CREATED
        response_json = response.get_json() # Extract the JSON data from the response    
        self.assertIn('message', response_json) # Ensure the 'message' key is in the response
        self.assertEqual(response_json['message'], expected_message) # Check that the response message contains the expected message
        self.assertIn('company_id', response_json) # Ensure the 'company_id' key is in the response
        self.assertEqual(len(response_json['company_id']), 36) # Check that the response message contains a 36 character company id
        response = self.client.get('/companies') # Make a GET request to the Categories/Categories endpoint
        self.assertEqual(response.status_code, 200) # Check that the response status code is 200 OK
        actual_results = json.loads(response.data) # Parse the JSON response  
        for i in range(len(expected_results)):
            self.assertEqual(actual_results[i]['company_name'], expected_results[i]['company_name']) # Check the company names
            self.assertEqual(actual_results[i]['category_id'], expected_results[i]['category_id']) # Check the category id

    
    def test_put_company(self):
        """Test confirms that PUT /company/<company_id> will update an existing company"""
        
        # Arrange 
        company_id = '04030201-0605-0807-0910-111213141511'
        updatedCompanyName = 'Updated Company Name'
        updatedLatitude = 10
        updatedLongitude = 20
        expected_message = 'Company updated successfully'
        
        # Act
        response = self.client.put(f'/company/{company_id}', json={'Company Name': updatedCompanyName, 'Latitude': updatedLatitude, 'Longitude': updatedLongitude})
        
        # Assert
        self.assertEqual(response.status_code, 200) # Check that the response status code is 200 OK
        response_json = response.get_json() # Extract the JSON data from the response
        self.assertIn('message', response_json) # Ensure the 'message' key is in the response
        self.assertEqual(response_json['message'], expected_message) # Check that the response message contains the expected message
        
        response = self.client.get(f'/company/{company_id}/details') # Make a GET request to get the updated company details
        self.assertEqual(response.status_code, 200) # Check that the response status code is 200 OK
        company_data = json.loads(response.data)
        self.assertEqual(company_data['company_name'], updatedCompanyName) # Check the updated company name
        self.assertEqual(company_data['latitude'], updatedLatitude) # Check the updated latitude
        self.assertEqual(company_data['longitude'], updatedLongitude) # Check the updated longitude

    def test_delete_company(self):
        """Test confirms that DELETE /company/<company_id> will delete an existing company"""

        # Arrange 
        company_id = '04030201-0605-0807-0910-111213141511'
        expected_message = 'Company deleted successfully'

        # Act
        response = self.client.delete(f'/company/{company_id}')

        # Assert
        self.assertEqual(response.status_code, 200) # Check that the response status code is 200 OK
        response_json = response.get_json() # Extract the JSON data from the response
        self.assertIn('message', response_json) # Ensure the 'message' key is in the response
        self.assertEqual(response_json['message'], expected_message) # Check that the response message contains the expected message
  

if __name__ == '__main__':
    unittest.main()