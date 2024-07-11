import unittest
import json
import os
from flask import Flask
from flask_cors import CORS
from flask_restx import Api
from unittest.mock import patch
from database_extensions import database_extensions
from endpoint_companies import api as namespaceCompanies
from datetime import date

class endpoint_companies_tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Set up for unit tests, executed once for the class"""
        
        # Create Postgres database for unit testing 
        cls.db = database_extensions()
        cls.unittest = cls.db.create_database_and_tables("Backend\\database_schema.sql")

        # Create the Flask test client
        cls.app = Flask(__name__)
        CORS(cls.app)  # Allow CORS for all routes
        cls.api = Api(cls.app, version='1.0', title='PI Firmware', description='Pi Side Firmware Controller')
        cls.api.add_namespace(namespaceCompanies, path='/')
        cls.client = cls.app.test_client()
        cls.app.config['TESTING'] = True

    def setUp(self):
        # Populate database with test data
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            self.db.execute("delete from companies")           
            self.db.execute("INSERT INTO companies (company_id, company_name, category_id,latitude,longitude) VALUES ('04030201-0605-0807-0910-111213141511', 'bollington', '04030201-0605-0807-0910-111213141520', 53.293571, -2.110140)")
            self.db.execute("INSERT INTO companies (company_id, company_name, category_id,latitude,longitude) VALUES ('04030201-0605-0807-0910-111213141512', 'mansfield', '04030201-0605-0807-0910-111213141530',53.143871, -1.199110)")

    def test_get_companies(self):
        """Test confirms that GET /companies will return a list of all the companies"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            expected_result = [
                {'company_id': '04030201-0605-0807-0910-111213141511', 'company_name': 'bollington', 'category_id': '04030201-0605-0807-0910-111213141520','advert_image': None, 'advert_text': None,'advert_type': 'Text'},
                {'company_id': '04030201-0605-0807-0910-111213141512', 'company_name': 'mansfield', 'category_id': '04030201-0605-0807-0910-111213141530','advert_image': None, 'advert_text': None,'advert_type': 'Text'}
            ]

            # Act
            response = self.client.get('/companies') # Make a GET request to the companies endpoint

            # Assert
            self.assertEqual(response.status_code, 200) # Check that the response status code is 200 OK
            actual_result = json.loads(response.data) # Parse the JSON response        
            self.assertEqual(actual_result, expected_result) # Check that the response contains the expected data
    
    def test_get_companies_by_category(self):
        """Test confirms that GET /companies/<category_id> will return a list of all the companies within a category"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            expected_result = [
                {'company_id': '04030201-0605-0807-0910-111213141512', 'company_name': 'mansfield', 'category_id': '04030201-0605-0807-0910-111213141530','advert_image': None, 'advert_text': None,'advert_type': 'Text',}
            ]

            # Act
            response = self.client.get('/companies/04030201-0605-0807-0910-111213141530') # Make a GET request to the companies endpoint

            # Assert
            self.assertEqual(response.status_code, 200) # Check that the response status code is 200 OK
            actual_result = json.loads(response.data) # Parse the JSON response        
            self.assertEqual(actual_result, expected_result) # Check that the response contains the expected data

    def test_get_companies_by_distance16(self):
        """Test confirms that GET /companies will return a list of all the companies by distance """
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # - Log and Lat
            # Macclesfield = 53.260841, -2.128190
            # Bollington = 53.293571, -2.110140
            # Mansfield = 53.143871, -1.199110

            # Arrange 
            expectedName = "bollington"
            expectedCompanyId = '04030201-0605-0807-0910-111213141511'

            # Act
            response = self.client.get('/companies/04030201-0605-0807-0910-111213141520/53.260841/-2.128190/16') # Make a GET request to the companies endpoint

            # Assert
            self.assertEqual(response.status_code, 200) # Check that the response status code is 200 OK
            actual_result = json.loads(response.data) # Parse the JSON response        
            self.assertEqual(1, len(actual_result)) # Confirm the number of results
            self.assertEqual(expectedName, actual_result[0]['company_name']) 
            self.assertEqual(expectedCompanyId, actual_result[0]['company_id']) 
    
    def test_get_companies_by_distance16DifferentCategory(self):
        """Test confirms that GET /companies will return a list of all the companies by distance by distance 16"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
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
            self.assertEqual(0, len(actual_result)) # Confirm the number of results, there should be zero companies that match the category and distance
        
    def test_get_companies_by_distance100(self):
        """Test confirms that GET /companies will return a list of all the companies by distance 100"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # - Log and Lat
            # Macclesfield = 53.260841, -2.128190
            # Bollington = 53.293571, -2.110140
            # Mansfield = 53.143871, -1.199110

            # Arrange 
            expectedName = "mansfield"
            expectedCompanyId = '04030201-0605-0807-0910-111213141512'

            # Act
            response = self.client.get('/companies/04030201-0605-0807-0910-111213141530/53.260841/-2.128190/100') # Make a GET request to the companies endpoint

            # Assert
            self.assertEqual(response.status_code, 200) # Check that the response status code is 200 OK
            actual_result = json.loads(response.data) # Parse the JSON response        
            self.assertEqual(1, len(actual_result)) # Confirm the number of results
            self.assertEqual(expectedName, actual_result[0]['company_name']) 
            self.assertEqual(expectedCompanyId, actual_result[0]['company_id']) 

    def test_get_company(self):
        """Test confirms that GET /company/<company_id>/details will return a company details"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            expected_result = {'company_id': '04030201-0605-0807-0910-111213141511', 'company_name': 'bollington', 'category_id': '04030201-0605-0807-0910-111213141520','email':None,'latitude':53.293571,'longitude':-2.11014,'phone':None,'website':None,'created_by_user_id': None,'created_date': None}        

            # Act
            response = self.client.get('/company/04030201-0605-0807-0910-111213141511/details') # Make a GET request to the company endpoint

            # Assert
            self.assertEqual(response.status_code, 200) # Check that the response status code is 200 OK
            actual_result = json.loads(response.data) # Parse the JSON response        
            self.assertEqual(actual_result, expected_result) # Check that the response contains the expected data        

    def test_get_company_bad_company_id(self):
        """Test confirms that GET /company/<company_id>/details will return an error when the company id does not exist"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
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
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
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
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):        
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
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
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
    
    def test_post_company_withAdvertText(self):
        """Test confirms that POST /company will add a new company with basic advert text"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            expectedCompanyName = 'zcomp1'
            expectedCategoryId = '04030201-0605-0807-0910-111213141530'
            expectedLatitude = '1'
            expectedLongitude = '2'
            expectedAdvert = "Hi1"
            expectedType = "Text"
            expected_results = [
                {'company_id': '04030201-0605-0807-0910-111213141511', 'company_name': 'bollington', 'category_id': '04030201-0605-0807-0910-111213141520', 'advert_type':'Text', 'advert_text':None},
                {'company_id': '04030201-0605-0807-0910-111213141512', 'company_name': 'mansfield', 'category_id': '04030201-0605-0807-0910-111213141530', 'advert_type':'Text', 'advert_text':None},
                {'company_id': '04030201-0605-0807-0910-111213141512', 'company_name': expectedCompanyName, 'category_id': expectedCategoryId, 'Latitude': expectedLatitude, 'Longitude':expectedLongitude, 'advert_type':expectedType, 'advert_text':expectedAdvert}
            ]        
            expected_message = 'Company added successfully'

            # Act
            response = self.client.post('/company', json={'Company Name':expectedCompanyName, 'Category Id':expectedCategoryId, 'Latitude': expectedLatitude, 'Longitude':expectedLongitude, 'Advert Text': expectedAdvert, 'Advert Type':expectedType})

            # Assert
            response_json = response.get_json() # Extract the JSON data from the response    
            self.assertIn('message', response_json) # Ensure the 'message' key is in the response
            self.assertEqual(response_json['message'], expected_message) # Check that the response message contains the expected message
            self.assertIn('company_id', response_json) # Ensure the 'company_id' key is in the response
            self.assertEqual(len(response_json['company_id']), 36) # Check that the response message contains a 36 character company id
            self.assertEqual(response.status_code, 201) # Check that the response status code is 201 CREATED
            response = self.client.get('/companies') # Make a GET request to the Categories/Categories endpoint
            self.assertEqual(response.status_code, 200) # Check that the response status code is 200 OK
            actual_results = json.loads(response.data) # Parse the JSON response  
            for i in range(len(expected_results)):
                self.assertEqual(actual_results[i]['company_name'], expected_results[i]['company_name']) # Check the company names
                self.assertEqual(actual_results[i]['category_id'], expected_results[i]['category_id']) # Check the category id
                self.assertEqual(actual_results[i]['advert_type'], expected_results[i]['advert_type'])
                self.assertEqual(actual_results[i]['advert_text'], expected_results[i]['advert_text'])
    
    def test_post_company_withBadAdvertTest(self):
        """Test confirms that POST /company will NOT add a new company with basic advert that contains bad text"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            expectedCompanyName = 'zcomp1'
            expectedCategoryId = '04030201-0605-0807-0910-111213141530'
            expectedLatitude = '1'
            expectedLongitude = '2'
            expectedAdvert = "This advert contains ass word and an email example@example.com"
            expectedType = "Text"
            expected_message = "Invalid advert text because Basic advert must not contain an email address, Advert must not contain word ass"

            # Act
            response = self.client.post('/company', json={'Company Name':expectedCompanyName, 'Category Id':expectedCategoryId, 'Latitude': expectedLatitude, 'Longitude':expectedLongitude, 'Advert Text': expectedAdvert, 'Advert Type':expectedType})

            # Assert
            response_json = response.get_json() # Extract the JSON data from the response    
            self.assertIn('message', response_json) # Ensure the 'message' key is in the response
            self.assertEqual(response_json['message'], expected_message) # Check that the response message contains the expected message

    def test_post_company_withCustomAdvertText(self):
        """Test confirms that POST /company will add a new company with custom advert text"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            advert = "Hi1"
            expectedCompanyName = 'zcomp1'
            expectedCategoryId = '04030201-0605-0807-0910-111213141530'
            expectedLatitude = '1'
            expectedLongitude = '2'
            expectedAdvert = "zcomp1\nHi1"
            expectedType = "TextCustom"
            expected_results = [
                {'company_id': '04030201-0605-0807-0910-111213141511', 'company_name': 'bollington', 'category_id': '04030201-0605-0807-0910-111213141520', 'advert_type':'Text', 'advert_text':None},
                {'company_id': '04030201-0605-0807-0910-111213141512', 'company_name': 'mansfield', 'category_id': '04030201-0605-0807-0910-111213141530', 'advert_type':'Text', 'advert_text':None},
                {'company_id': '04030201-0605-0807-0910-111213141512', 'company_name': expectedCompanyName, 'category_id': expectedCategoryId, 'Latitude': expectedLatitude, 'Longitude':expectedLongitude, 'advert_type':expectedType, 'advert_text':expectedAdvert}
            ]        
            expected_message = 'Company added successfully'

            # Act
            response = self.client.post('/company', json={'Company Name':expectedCompanyName, 'Category Id':expectedCategoryId, 'Latitude': expectedLatitude, 'Longitude':expectedLongitude, 'Advert Text': advert, 'Advert Type':expectedType})

            # Assert
            response_json = response.get_json() # Extract the JSON data from the response    
            self.assertIn('message', response_json) # Ensure the 'message' key is in the response
            self.assertEqual(response_json['message'], expected_message) # Check that the response message contains the expected message
            self.assertIn('company_id', response_json) # Ensure the 'company_id' key is in the response
            self.assertEqual(len(response_json['company_id']), 36) # Check that the response message contains a 36 character company id
            self.assertEqual(response.status_code, 201) # Check that the response status code is 201 CREATED
            response = self.client.get('/companies') # Make a GET request to the Categories/Categories endpoint
            self.assertEqual(response.status_code, 200) # Check that the response status code is 200 OK
            actual_results = json.loads(response.data) # Parse the JSON response  
            for i in range(len(expected_results)):
                self.assertEqual(actual_results[i]['company_name'], expected_results[i]['company_name']) # Check the company names
                self.assertEqual(actual_results[i]['category_id'], expected_results[i]['category_id']) # Check the category id
                self.assertEqual(actual_results[i]['advert_type'], expected_results[i]['advert_type'])
                self.assertEqual(actual_results[i]['advert_text'], expected_results[i]['advert_text'])

    def test_post_company_withBadCustomAdvertTest(self):
        """Test confirms that POST /company will NOT add a new company with custom advert that contains bad text"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            expectedCompanyName = 'zcomp1'
            expectedCategoryId = '04030201-0605-0807-0910-111213141530'
            expectedLatitude = '1'
            expectedLongitude = '2'
            expectedAdvert = "This advert contains ass word and an email example@example.com"
            expectedType = "TextCustom"
            expected_message = "Invalid advert text because Advert must not contain word ass"

            # Act
            response = self.client.post('/company', json={'Company Name':expectedCompanyName, 'Category Id':expectedCategoryId, 'Latitude': expectedLatitude, 'Longitude':expectedLongitude, 'Advert Text': expectedAdvert, 'Advert Type':expectedType})

            # Assert
            response_json = response.get_json() # Extract the JSON data from the response    
            self.assertIn('message', response_json) # Ensure the 'message' key is in the response
            self.assertEqual(response_json['message'], expected_message) # Check that the response message contains the expected message

    def test_post_company_withBadAdvertType(self):
        """Test confirms that POST /company will NOT add a new company with basic advert that contains bad text"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            expectedCompanyName = 'zcomp1'
            expectedCategoryId = '04030201-0605-0807-0910-111213141530'
            expectedLatitude = '1'
            expectedLongitude = '2'
            expectedAdvert = "This is a valid advert text."
            expectedType = "BadAdvertType"
            expected_message = "Invalid advert type: BadAdvertType, valid types are Text, TextCustom, ImageSmall, ImageMedium, ImageLarge"

            # Act
            response = self.client.post('/company', json={'Company Name':expectedCompanyName, 'Category Id':expectedCategoryId, 'Latitude': expectedLatitude, 'Longitude':expectedLongitude, 'Advert Text': expectedAdvert, 'Advert Type':expectedType})

            # Assert
            response_json = response.get_json() # Extract the JSON data from the response    
            self.assertIn('message', response_json) # Ensure the 'message' key is in the response
            self.assertEqual(response_json['message'], expected_message) # Check that the response message contains the expected message

    def test_post_company_with_used_id(self):
        """Test confirms that POST /company will add a new company with user id and created date"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            expectedUserId = '0348680a-fc37-4334-9bc7-51d247f50c11'

            # Act
            response = self.client.post('/company', json={'Company Name':'zcomp1', 'Category Id':'04030201-0605-0807-0910-111213141530', 'Latitude': '1', 'Longitude':'2', 'User Id':expectedUserId})

            # Assert
            self.assertEqual(response.status_code, 201) # Check that the response status code is 201 CREATED
            response_json = response.get_json() # Extract the JSON data from the response    
            self.assertIn('message', response_json) # Ensure the 'message' key is in the response
            self.assertEqual(response_json['message'], 'Company added successfully') # Check that the response message contains the expected message
            self.assertIn('company_id', response_json) # Ensure the 'company_id' key is in the response
            newCompanyId = response_json['company_id']
            self.assertEqual(len(newCompanyId), 36) # Check that the response message contains a 36 character company id
            response = self.client.get(f'/company/{newCompanyId}/details') # Make a GET request to the company details endpoint
            self.assertEqual(response.status_code, 200) # Check that the response status code is 200 OK
            actual_results = json.loads(response.data) # Parse the JSON response  
            self.assertEqual(actual_results['created_by_user_id'], expectedUserId) # Check id of the user that created the company
            self.assertEqual(actual_results['created_date'],  date.today().strftime('%Y-%m-%d')) # Check date the company was created

if __name__ == '__main__':
    unittest.main()