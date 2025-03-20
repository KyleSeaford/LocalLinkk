import unittest
import json
import os
from flask import Flask
from flask_cors import CORS
from flask_restx import Api
from endpoint_categories import api as namespaceCategories
from unittest.mock import patch
from database_extensions import database_extensions

class SystemSettingsTestCase(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Set up for unit tests, function is executed before tests begin"""

        # Create Postgres database for unit testing 
        cls.db = database_extensions()
        cls.unittest = cls.db.create_database_and_tables("Backend\\database_schema.sql")

        # Create the Flask test client
        cls.app = Flask(__name__)
        CORS(cls.app)  # Allow CORS for all routes
        cls.api = Api(cls.app, version='1.0', title='PI Firmware', description='Pi Side Firmware Controller')
        cls.api.add_namespace(namespaceCategories, path='/')
        cls.client = cls.app.test_client()
        cls.app.config['TESTING'] = True

    def setUp(self):
        """Set up for unit tests, function is executed before tests begin"""

        # Populate database with test data
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            self.db.execute("delete from categories")
            self.db.execute("INSERT INTO categories (category_id, category_name, parent_category_id) VALUES ('04030201-0605-0807-0910-111213141516', 'Cat1', '0')")
            self.db.execute("INSERT INTO categories (category_id, category_name, parent_category_id) VALUES ('04030201-0605-0807-0910-111213141517', 'Cat2', '04030201-0605-0807-0910-111213141516')")

    def test_get_categories(self):
        """Test confirms that GET /Categories will return a list of all the categories"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            expected_result = [
                {'category_id': '04030201-0605-0807-0910-111213141516', 'category_name': 'Cat1', 'parent_category_id': '0'},
                {'category_id': '04030201-0605-0807-0910-111213141517', 'category_name': 'Cat2', 'parent_category_id': '04030201-0605-0807-0910-111213141516'}
            ]

            # Act
            response = self.client.get('/categories') # Make a GET request to the Categories/Categories endpoint

            # Assert
            self.assertEqual(response.status_code, 200) # Check that the response status code is 200 OK
            actual_result = json.loads(response.data) # Parse the JSON response        
            self.assertEqual(actual_result, expected_result) # Check that the response contains the expected data
    
    def test_get_category(self):
        """Test confirms that GET /category/{id} will return a category"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            categoryId = '04030201-0605-0807-0910-111213141517'
            expected_result = {'category_id': '04030201-0605-0807-0910-111213141517', 'category_name': 'Cat2', 'parent_category_id': '04030201-0605-0807-0910-111213141516'}
            
            # Act
            response = self.client.get(f'/category/{categoryId}') # Make a GET request to the Categories/Category/{id} endpoint

            # Assert
            self.assertEqual(response.status_code, 200) # Check that the response status code is 200 OK
            actual_result = json.loads(response.data) # Parse the JSON response        
            self.assertEqual(actual_result, expected_result) # Check that the response contains the expected data
    
    def test_get_category_bad_category_id(self):
        """Test confirms that GET /category/{id} will return an error when the category id does not exist"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            categoryId = 'bad'
            expected_message = 'Category bad does not exists'
            
            # Act
            response = self.client.get(f'/category/{categoryId}') # Make a GET request to the Categories/Category/{id} endpoint

            # Assert
            self.assertEqual(response.status_code, 400) # Check that the response status code is 400 BAD
            self.assertEqual(response.status, '400 BAD REQUEST') # Check the response status message        
            response_json = response.get_json() # Extract the JSON data from the response    
            self.assertIn('message', response_json) # Ensure the 'message' key is in the response
            self.assertEqual(response_json['message'], expected_message) # Check that the response message contains the expected message

    def test_post_category(self):
        """Test confirms that POST /Category will add a new category"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            expected_results = [
                {'category_id': '04030201-0605-0807-0910-111213141516', 'category_name': 'Cat1', 'parent_category_id': '0'},
                {'category_id': '04030201-0605-0807-0910-111213141517', 'category_name': 'Cat2', 'parent_category_id': '04030201-0605-0807-0910-111213141516'},
                {'category_id': '04030201-0605-0807-0910-111213141517', 'category_name': 'Cat3', 'parent_category_id': '04030201-0605-0807-0910-111213141517'}
            ]
            expected_message = 'Category added successfully'

            # Act
            response = self.client.post('/category', json={'Category Name':'Cat3', 'Parent Category Id':'04030201-0605-0807-0910-111213141517'})

            # Assert
            self.assertEqual(response.status_code, 201) # Check that the response status code is 201 CREATED
            response_json = response.get_json() # Extract the JSON data from the response    
            self.assertIn('message', response_json) # Ensure the 'message' key is in the response
            self.assertEqual(response_json['message'], expected_message) # Check that the response message contains the expected message
            self.assertIn('category_id', response_json) # Ensure the 'category_id' key is in the response
            self.assertEqual(len(response_json['category_id']), 36) # Check that the response message contains a 36 character category id
            response = self.client.get('/categories') # Make a GET request to the Categories/Categories endpoint
            self.assertEqual(response.status_code, 200) # Check that the response status code is 200 OK
            actual_results = json.loads(response.data) # Parse the JSON response  
            for i in range(len(expected_results)):
                self.assertEqual(actual_results[i]['category_name'], expected_results[i]['category_name']) # Check the category names
                self.assertEqual(actual_results[i]['parent_category_id'], expected_results[i]['parent_category_id']) # Check the parent category id

    def test_post_category_no_post_data(self):
        """Test confirms that POST /category will return 415 when post request does not contain the json data"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 

            # Act
            response = self.client.post('/category') # Make a POST request to the /category endpoint without json data

            # Assert
            self.assertEqual(response.status_code, 400) # Check that the response status code is 415
            self.assertEqual(response.status, '400 BAD REQUEST') # Check the response status message  
    
    def test_post_category_already_exists(self):
        """Test confirms that POST /Category will return an error when the category already exists"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            expected_message = 'Category Cat2 already exists'
            name = 'Cat2'
            parent = '04030201-0605-0807-0910-111213141516'

            # Act
            response = self.client.post('/category', json={'Category Name':name, 'Parent Category Id':parent})

            # Assert
            self.assertEqual(response.status_code, 400) # Check that the response status code is 415
            self.assertEqual(response.status, '400 BAD REQUEST') # Check the response status message  
            response_json = response.get_json() # Extract the JSON data from the response    
            self.assertIn('message', response_json) # Ensure the 'message' key is in the response
            self.assertEqual(response_json['message'], expected_message) # Check that the response message contains the expected message
    
    def test_post_category_bad_parent_id(self):
        """Test confirms that POST /Category will return an error when the parent category id dose not exists"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            expected_message = 'Parent Category bad does not exists'
            name = 'Cat2'
            parent = 'bad'

            # Act
            response = self.client.post('/category', json={'Category Name':name, 'Parent Category Id':parent})

            # Assert
            self.assertEqual(response.status_code, 400) # Check that the response status code is 415
            self.assertEqual(response.status, '400 BAD REQUEST') # Check the response status message  
            response_json = response.get_json() # Extract the JSON data from the response    
            self.assertIn('message', response_json) # Ensure the 'message' key is in the response
            self.assertEqual(response_json['message'], expected_message) # Check that the response message contains the expected message
    
    def test_get_children_categories(self):
        """Test confirms that GET /Category/{id}/children will return a list of all child categories"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            parent = '04030201-0605-0807-0910-111213141516'
            expected_result = [            
                {'category_id': '04030201-0605-0807-0910-111213141517', 'category_name': 'Cat2', 'parent_category_id': '04030201-0605-0807-0910-111213141516'}
            ]

            # Act
            response = self.client.get(f'/category/{parent}/children') # Make a GET request to the /Category/{id}/children endpoint

            # Assert
            self.assertEqual(response.status_code, 200) # Check that the response status code is 200 OK
            actual_result = json.loads(response.data) # Parse the JSON response        
            self.assertEqual(actual_result, expected_result) # Check that the response contains the expected data
    
    def test_get_category_bread_crumbs(self):
        """Test confirms that GET /Category/{id}/breadcrumbs will return bread crumbs"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            id = '04030201-0605-0807-0910-111213141517'
            expected_result = json.loads('{"bread_crumbs": "Cat1 >> Cat2"}')

            # Act
            response = self.client.get(f'/category/{id}/breadcrumbs') # Make a GET request to the /Category/{id}/breadcrumbs endpoint

            # Assert
            self.assertEqual(response.status_code, 200) # Check that the response status code is 200 OK
            actual_result = json.loads(response.data) # Parse the JSON response        
            self.assertEqual(actual_result, expected_result) # Check that the response contains the expected data
    
    def test_put_category(self):
        """Test confirms that PUT /Category/<id> will update an existing category"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            category_id = '04030201-0605-0807-0910-111213141517'
            updated_category_name = 'UpdatedCat'
            updated_parent_category_id = '04030201-0605-0807-0910-111213141516'
            expected_message = 'Category updated successfully'

            # Act
            response = self.client.put(f'/category/{category_id}', json={'Category Name': updated_category_name, 'Parent Category Id': updated_parent_category_id})

            # Assert
            self.assertEqual(response.status_code, 200) # Check that the response status code is 200 OK
            response_json = response.get_json() # Extract the JSON data from the response    
            self.assertIn('message', response_json) # Ensure the 'message' key is in the response
            self.assertEqual(response_json['message'], expected_message) # Check that the response message contains the expected message
            response = self.client.get(f'/category/{category_id}') # Make a GET request to the updated category endpoint
            self.assertEqual(response.status_code, 200) # Check that the response status code is 200 OK
            actual_result = json.loads(response.data) # Parse the JSON response
            self.assertEqual(actual_result['parent_category_id'], updated_parent_category_id) # Check the updated parent category id
            self.assertEqual(actual_result['category_name'], updated_category_name) # Check the updated category name

    def test_delete_category(self):
        """Test confirms that DELETE /Category/<id> will delete an existing category"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            category_id = '04030201-0605-0807-0910-111213141517'
            expected_message = 'Category deleted successfully'

            # Act
            response = self.client.delete(f'/category/{category_id}')

            # Assert
            self.assertEqual(response.status_code, 200) # Check that the response status code is 200 OK
            response_json = response.get_json() # Extract the JSON data from the response    
            self.assertIn('message', response_json) # Ensure the 'message' key is in the response
            self.assertEqual(response_json['message'], expected_message) # Check that the response message contains the expected message
            response = self.client.get('/categories') # Act to verify category is actually deleted, make a GET request to the categories endpoint
            self.assertEqual(response.status_code, 200) # Check that the response status code is 200 OK
            actual_result = json.loads(response.data) # Parse the JSON response
            # Ensure the deleted category is not in the response
            for category in actual_result:
                self.assertNotEqual(category['category_id'], category_id) # Check that the deleted category id is not in the returned list of categories


    def test_get_categories_hierarchical(self):
        """Test confirms that GET /Categories/hierarchical will return a list of hierarchical categories"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            expected_result = [
            {
                "category_id": "04030201-0605-0807-0910-111213141516",
                "category_name": "Cat1",        
                "children": [
                {
                    "category_id": "04030201-0605-0807-0910-111213141517",
                    "category_name": "Cat2",            
                    "children": [            
                    ],
                    "parent_category_id": "04030201-0605-0807-0910-111213141516",
                }        
                ],
                "parent_category_id": "0"}
            ]

            # Act
            response = self.client.get('/categories/hierarchical') # Make a GET request to the Categories/Categories endpoint

            # Assert
            self.assertEqual(response.status_code, 200) # Check that the response status code is 200 OK
            actual_result = json.loads(response.data) # Parse the JSON response  
            self.assertEqual(actual_result, expected_result) # Check that the response contains the expected data

if __name__ == '__main__':
    unittest.main()