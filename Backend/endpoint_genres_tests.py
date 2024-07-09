import unittest
import json
import os
from flask import Flask
from flask_cors import CORS
from flask_restx import Api
from endpoint_genres import api as namespaceGenres
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
        cls.api = Api(cls.app, version='1.0', title='PI Firmware', description='Genres Unit Tests Controller')
        cls.api.add_namespace(namespaceGenres, path='/')
        cls.client = cls.app.test_client()
        cls.app.config['TESTING'] = True

    def setUp(self):
        """Set up for unit tests, function is executed before tests begin"""

        # Populate database with test data
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            self.db.execute("delete from genres")
            self.db.execute("INSERT INTO genres (genre_id, genre_name, parent_genre_id) VALUES ('04030201-0605-0807-0910-111213141516', 'Cat1', '0')")
            self.db.execute("INSERT INTO genres (genre_id, genre_name, parent_genre_id) VALUES ('04030201-0605-0807-0910-111213141517', 'Cat2', '04030201-0605-0807-0910-111213141516')")

    def test_get_Genres(self):
        """Test confirms that GET /Genres will return a list of all the Genres"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            expected_result = [
                {'genre_id': '04030201-0605-0807-0910-111213141516', 'genre_name': 'Cat1', 'parent_genre_id': '0'},
                {'genre_id': '04030201-0605-0807-0910-111213141517', 'genre_name': 'Cat2', 'parent_genre_id': '04030201-0605-0807-0910-111213141516'}
            ]

            # Act
            response = self.client.get('/genres') # Make a GET request to the Genres/Genres endpoint

            # Assert
            self.assertEqual(response.status_code, 200) # Check that the response status code is 200 OK
            actual_result = json.loads(response.data) # Parse the JSON response        
            self.assertEqual(actual_result, expected_result) # Check that the response contains the expected data
    
    def test_get_genre(self):
        """Test confirms that GET /genre/{id} will return a genre"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            genreId = '04030201-0605-0807-0910-111213141517'
            expected_result = {'genre_id': '04030201-0605-0807-0910-111213141517', 'genre_name': 'Cat2', 'parent_genre_id': '04030201-0605-0807-0910-111213141516'}
            
            # Act
            response = self.client.get(f'/genre/{genreId}') # Make a GET request to the Genres/genre/{id} endpoint

            # Assert
            self.assertEqual(response.status_code, 200) # Check that the response status code is 200 OK
            actual_result = json.loads(response.data) # Parse the JSON response        
            self.assertEqual(actual_result, expected_result) # Check that the response contains the expected data
    
    def test_get_genre_bad_genre_id(self):
        """Test confirms that GET /genre/{id} will return an error when the genre id does not exist"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            genreId = 'bad'
            expected_message = 'genre bad does not exists'
            
            # Act
            response = self.client.get(f'/genre/{genreId}') # Make a GET request to the Genres/genre/{id} endpoint

            # Assert
            self.assertEqual(response.status_code, 400) # Check that the response status code is 400 BAD
            self.assertEqual(response.status, '400 BAD REQUEST') # Check the response status message        
            response_json = response.get_json() # Extract the JSON data from the response    
            self.assertIn('message', response_json) # Ensure the 'message' key is in the response
            self.assertEqual(response_json['message'], expected_message) # Check that the response message contains the expected message

    def test_post_genre(self):
        """Test confirms that POST /genre will add a new genre"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            expected_results = [
                {'genre_id': '04030201-0605-0807-0910-111213141516', 'genre_name': 'Cat1', 'parent_genre_id': '0'},
                {'genre_id': '04030201-0605-0807-0910-111213141517', 'genre_name': 'Cat2', 'parent_genre_id': '04030201-0605-0807-0910-111213141516'},
                {'genre_id': '04030201-0605-0807-0910-111213141517', 'genre_name': 'Cat3', 'parent_genre_id': '04030201-0605-0807-0910-111213141517'}
            ]
            expected_message = 'genre added successfully'

            # Act
            response = self.client.post('/genre', json={'genre Name':'Cat3', 'Parent genre Id':'04030201-0605-0807-0910-111213141517'})

            # Assert
            self.assertEqual(response.status_code, 201) # Check that the response status code is 201 CREATED
            response_json = response.get_json() # Extract the JSON data from the response    
            self.assertIn('message', response_json) # Ensure the 'message' key is in the response
            self.assertEqual(response_json['message'], expected_message) # Check that the response message contains the expected message
            self.assertIn('genre_id', response_json) # Ensure the 'genre_id' key is in the response
            self.assertEqual(len(response_json['genre_id']), 36) # Check that the response message contains a 36 character genre id
            response = self.client.get('/genres') # Make a GET request to the Genres/Genres endpoint
            self.assertEqual(response.status_code, 200) # Check that the response status code is 200 OK
            actual_results = json.loads(response.data) # Parse the JSON response  
            for i in range(len(expected_results)):
                self.assertEqual(actual_results[i]['genre_name'], expected_results[i]['genre_name']) # Check the genre names
                self.assertEqual(actual_results[i]['parent_genre_id'], expected_results[i]['parent_genre_id']) # Check the parent genre id

    def test_post_genre_no_post_data(self):
        """Test confirms that POST /genre will return 415 when post request does not contain the json data"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 

            # Act
            response = self.client.post('/genre') # Make a POST request to the /genre endpoint without json data

            # Assert
            self.assertEqual(response.status_code, 400) # Check that the response status code is 415
            self.assertEqual(response.status, '400 BAD REQUEST') # Check the response status message  
    
    def test_post_genre_already_exists(self):
        """Test confirms that POST /genre will return an error when the genre already exists"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            expected_message = 'genre Cat2 already exists'
            name = 'Cat2'
            parent = '04030201-0605-0807-0910-111213141516'

            # Act
            response = self.client.post('/genre', json={'genre Name':name, 'Parent genre Id':parent})

            # Assert
            self.assertEqual(response.status_code, 400) # Check that the response status code is 415
            self.assertEqual(response.status, '400 BAD REQUEST') # Check the response status message  
            response_json = response.get_json() # Extract the JSON data from the response    
            self.assertIn('message', response_json) # Ensure the 'message' key is in the response
            self.assertEqual(response_json['message'], expected_message) # Check that the response message contains the expected message
    
    def test_post_genre_bad_parent_id(self):
        """Test confirms that POST /genre will return an error when the parent genre id dose not exists"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            expected_message = 'Parent genre bad does not exists'
            name = 'Cat2'
            parent = 'bad'

            # Act
            response = self.client.post('/genre', json={'genre Name':name, 'Parent genre Id':parent})

            # Assert
            self.assertEqual(response.status_code, 400) # Check that the response status code is 415
            self.assertEqual(response.status, '400 BAD REQUEST') # Check the response status message  
            response_json = response.get_json() # Extract the JSON data from the response    
            self.assertIn('message', response_json) # Ensure the 'message' key is in the response
            self.assertEqual(response_json['message'], expected_message) # Check that the response message contains the expected message
    
    def test_get_children_Genres(self):
        """Test confirms that GET /genre/{id}/children will return a list of all child Genres"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            parent = '04030201-0605-0807-0910-111213141516'
            expected_result = [            
                {'genre_id': '04030201-0605-0807-0910-111213141517', 'genre_name': 'Cat2', 'parent_genre_id': '04030201-0605-0807-0910-111213141516'}
            ]

            # Act
            response = self.client.get(f'/genre/{parent}/children') # Make a GET request to the /genre/{id}/children endpoint

            # Assert
            self.assertEqual(response.status_code, 200) # Check that the response status code is 200 OK
            actual_result = json.loads(response.data) # Parse the JSON response        
            self.assertEqual(actual_result, expected_result) # Check that the response contains the expected data
    
    def test_get_genre_bread_crumbs(self):
        """Test confirms that GET /genre/{id}/breadcrumbs will return bread crumbs"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            id = '04030201-0605-0807-0910-111213141517'
            expected_result = json.loads('{"bread_crumbs": "Cat1 >> Cat2"}')

            # Act
            response = self.client.get(f'/genre/{id}/breadcrumbs') # Make a GET request to the /genre/{id}/breadcrumbs endpoint

            # Assert
            self.assertEqual(response.status_code, 200) # Check that the response status code is 200 OK
            actual_result = json.loads(response.data) # Parse the JSON response        
            self.assertEqual(actual_result, expected_result) # Check that the response contains the expected data
    
    def test_put_genre(self):
        """Test confirms that PUT /genre/<id> will update an existing genre"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            genre_id = '04030201-0605-0807-0910-111213141517'
            updated_genre_name = 'UpdatedCat'
            updated_parent_genre_id = '04030201-0605-0807-0910-111213141516'
            expected_message = 'genre updated successfully'

            # Act
            response = self.client.put(f'/genre/{genre_id}', json={'genre Name': updated_genre_name, 'Parent genre Id': updated_parent_genre_id})

            # Assert
            self.assertEqual(response.status_code, 200) # Check that the response status code is 200 OK
            response_json = response.get_json() # Extract the JSON data from the response    
            self.assertIn('message', response_json) # Ensure the 'message' key is in the response
            self.assertEqual(response_json['message'], expected_message) # Check that the response message contains the expected message
            response = self.client.get(f'/genre/{genre_id}') # Make a GET request to the updated genre endpoint
            self.assertEqual(response.status_code, 200) # Check that the response status code is 200 OK
            actual_result = json.loads(response.data) # Parse the JSON response
            self.assertEqual(actual_result['parent_genre_id'], updated_parent_genre_id) # Check the updated parent genre id
            self.assertEqual(actual_result['genre_name'], updated_genre_name) # Check the updated genre name

    def test_delete_genre(self):
        """Test confirms that DELETE /genre/<id> will delete an existing genre"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            genre_id = '04030201-0605-0807-0910-111213141517'
            expected_message = 'genre deleted successfully'

            # Act
            response = self.client.delete(f'/genre/{genre_id}')

            # Assert
            self.assertEqual(response.status_code, 200) # Check that the response status code is 200 OK
            response_json = response.get_json() # Extract the JSON data from the response    
            self.assertIn('message', response_json) # Ensure the 'message' key is in the response
            self.assertEqual(response_json['message'], expected_message) # Check that the response message contains the expected message
            response = self.client.get('/genres') # Act to verify genre is actually deleted, make a GET request to the Genres endpoint
            self.assertEqual(response.status_code, 200) # Check that the response status code is 200 OK
            actual_result = json.loads(response.data) # Parse the JSON response
            # Ensure the deleted genre is not in the response
            for genre in actual_result:
                self.assertNotEqual(genre['genre_id'], genre_id) # Check that the deleted genre id is not in the returned list of Genres


    def test_get_Genres_hierarchical(self):
        """Test confirms that GET /genres/hierarchical will return a list of hierarchical Genres"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            expected_result = [
            {
                "genre_id": "04030201-0605-0807-0910-111213141516",
                "genre_name": "Cat1",        
                "children": [
                {
                    "genre_id": "04030201-0605-0807-0910-111213141517",
                    "genre_name": "Cat2",            
                    "children": [            
                    ],
                    "parent_genre_id": "04030201-0605-0807-0910-111213141516",
                }        
                ],
                "parent_genre_id": "0"}
            ]

            # Act
            response = self.client.get('/genres/hierarchical') # Make a GET request to the Genres/Genres endpoint

            # Assert
            self.assertEqual(response.status_code, 200) # Check that the response status code is 200 OK
            actual_result = json.loads(response.data) # Parse the JSON response  
            self.assertEqual(actual_result, expected_result) # Check that the response contains the expected data

if __name__ == '__main__':
    unittest.main()