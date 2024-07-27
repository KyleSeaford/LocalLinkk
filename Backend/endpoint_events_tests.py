import unittest
import json
import os
from flask import Flask
from flask_cors import CORS
from flask_restx import Api
from unittest.mock import patch
from database_extensions import database_extensions
from endpoint_events import api as namespaceEvents
from datetime import date

class endpoint_events_tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Set up for unit tests, executed once for the class"""
        
        # Create Postgres database for unit testing 
        cls.db = database_extensions()
        cls.unittest = cls.db.create_database_and_tables("Backend\\database_schema.sql")

        # Create the Flask test client
        cls.app = Flask(__name__)
        CORS(cls.app)  # Allow CORS for all routes
        cls.api = Api(cls.app, version='1.0', title='PI Firmware', description='Events Controller')
        cls.api.add_namespace(namespaceEvents, path='/')
        cls.client = cls.app.test_client()
        cls.app.config['TESTING'] = True

    def setUp(self):
        # Populate database with test data
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            self.db.execute("delete from events")           
            self.db.execute("INSERT INTO events (event_id, event_name, genre_id,latitude,longitude,created_by_user_id) VALUES ('04030201-0605-0807-0910-111213141510', 'event0', '04030201-0605-0807-0910-111213141519', 53.293571, -2.110140, '444030201-0605-0807-0910-111213141519')")
            self.db.execute("INSERT INTO events (event_id, event_name, genre_id,latitude,longitude,created_by_user_id) VALUES ('04030201-0605-0807-0910-111213141511', 'event1', '04030201-0605-0807-0910-111213141520', 53.293571, -2.110140, '333030201-0605-0807-0910-111213141519')")
            self.db.execute("delete from series")
            self.db.execute("insert into series (series_id, created_by_user_id, recurrence) values ('04030201-0605-0807-0910-111213141522', '04030201-0605-0807-0910-111213141533', 'weekly on monday')")
            self.db.execute("delete from users")
            self.db.execute("insert into users (userid) values ('04030201-0605-0807-0910-111213141500')")
            self.db.execute("delete from genres")
            self.db.execute("insert into genres (genre_id) values ('04030201-0605-0807-0910-111213141544')")

    def test_get_events(self):
        """Test confirms that GET / will return a list of all the events"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            expected_result = [
                {"event_id": "04030201-0605-0807-0910-111213141510", "event_name": "event0", "advert_type": "Text", "advert_text": None, "advert_image": None},
                {"event_id": "04030201-0605-0807-0910-111213141511", "event_name": "event1", "advert_type": "Text", "advert_text": None, "advert_image": None}
            ]

            # Act
            response = self.client.get('/0/100') # Make a GET request to the events endpoint

            # Assert
            self.assertIn(response.status_code, [200, 308]) # Check that the response status code is 200 OK, 308 redirect (redirect caused by pagination)
            actual_result = json.loads(response.data) # Parse the JSON response     
            self.assertEqual(actual_result, expected_result) # Check that the response contains the expected data

    def test_get_series(self):
        """Test confirms that GET /series will return a list of all the series"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            expected_result = [
                {"series_id": "04030201-0605-0807-0910-111213141522", "created_date": None, "created_by_user_id": "04030201-0605-0807-0910-111213141533", "recurrence": "weekly on monday"}
            ]

            # Act
            response = self.client.get('/series/0/100') # Make a GET request to the events endpoint

            # Assert
            self.assertIn(response.status_code, [200, 308]) # Check that the response status code is 200 OK, 308 redirect (redirect caused by pagination)
            actual_result = json.loads(response.data) # Parse the JSON response     
            self.assertEqual(actual_result, expected_result) # Check that the response contains the expected data

    def test_get_events_by_user(self):
        """Test confirms that GET /byuser/<user_id> will return a list of all the events created by the user"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            expected_result = [
                {"event_id": "04030201-0605-0807-0910-111213141510", "event_name": "event0", "advert_type": "Text", "advert_text": None, "advert_image": None}
            ]

            # Act
            response = self.client.get('byuser/444030201-0605-0807-0910-111213141519/0/100') # Make a GET request to the events endpoint

            # Assert
            self.assertIn(response.status_code, [200, 308]) # Check that the response status code is 200 OK, 308 redirect (redirect caused by pagination)
            actual_result = json.loads(response.data) # Parse the JSON response     
            self.assertEqual(actual_result, expected_result) # Check that the response contains the expected data

    def test_get_events_by_series(self):
        """Test confirms that GET /byseries/<series_id> will return a list of all the events in the series"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            self.db.execute("INSERT INTO events (event_id, event_name, genre_id,latitude,longitude,created_by_user_id,series_id) VALUES ('04030201-0605-0807-0910-111213141441', 'event_a', '04030201-0605-0807-0910-111213141519', 53.293571, -2.110140, '444030201-0605-0807-0910-111213141519','444030201-0605-0807-0910-111213140000')")
            self.db.execute("INSERT INTO events (event_id, event_name, genre_id,latitude,longitude,created_by_user_id,series_id) VALUES ('04030201-0605-0807-0910-111213141442', 'event_b', '04030201-0605-0807-0910-111213141520', 53.293571, -2.110140, '333030201-0605-0807-0910-111213141519','444030201-0605-0807-0910-111213140000')")
            expected_result = [
                {"event_id": "04030201-0605-0807-0910-111213141441", "event_name": "event_a", "advert_type": "Text", "advert_text": None, "advert_image": None},
                {"event_id": "04030201-0605-0807-0910-111213141442", "event_name": "event_b", "advert_type": "Text", "advert_text": None, "advert_image": None}
            ]

            # Act
            response = self.client.get('byseries/444030201-0605-0807-0910-111213140000/0/100') # Make a GET request to the events endpoint

            # Assert
            self.assertIn(response.status_code, [200, 308]) # Check that the response status code is 200 OK, 308 redirect (redirect caused by pagination)
            actual_result = json.loads(response.data) # Parse the JSON response     
            self.assertEqual(actual_result, expected_result) # Check that the response contains the expected data

    def test_get_events_by_genre_date_location(self):
        """Test confirms that GET /bygenre will return a list of events filtered by genre, date and location"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            self.db.execute("INSERT INTO events (event_id, event_name, genre_id,latitude,longitude,created_by_user_id,series_id,event_date) VALUES ('04030201-0605-0807-0910-111213141441', 'event_a', '04030201-0605-0807-0910-111213141519', 53.293571, -2.110140, '444030201-0605-0807-0910-111213141519','444030201-0605-0807-0910-111213140000','2024-07-27')")
            self.db.execute("INSERT INTO events (event_id, event_name, genre_id,latitude,longitude,created_by_user_id,series_id,event_date) VALUES ('04030201-0605-0807-0910-111213141442', 'event_b', '04030201-0605-0807-0910-111213141520', 33.293571, -2.110140, '333030201-0605-0807-0910-111213141519','444030201-0605-0807-0910-111213140000','2024-07-02')")
            self.db.execute("INSERT INTO events (event_id, event_name, genre_id,latitude,longitude,created_by_user_id,series_id,event_date) VALUES ('04030201-0605-0807-0910-111213141443', 'event_c', '04030201-0605-0807-0910-111213141520', 33.293571, -2.110140, '333030201-0605-0807-0910-111213141519','444030201-0605-0807-0910-111213140000','2024-08-02')")
            expected_result = [
                {"event_id": "04030201-0605-0807-0910-111213141443", "event_name": "event_c", "advert_type": "Text", "advert_text": None, "advert_image": None}
            ]

            # Act
            response = self.client.get('bygenre/04030201-0605-0807-0910-111213141520/2024-08-01/2025-08-27/33.293571/-2.110140/10/0/100') # Make a GET request to the events endpoint

            # Assert
            self.assertIn(response.status_code, [200, 308]) # Check that the response status code is 200 OK, 308 redirect (redirect caused by pagination)
            actual_result = json.loads(response.data) # Parse the JSON response     
            self.assertEqual(actual_result, expected_result) # Check that the response contains the expected data

    def test_post_series(self):
        """Test confirms that POST /series will create a new event series"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            expected_message = 'Series added successfully'

            # Act
            response = self.client.post('/series', json={'created_by_user_id':'04030201-0605-0807-0910-111213141500', 'recurrence':'weekly on monday'})

            # Assert
            self.assertEqual(response.status_code, 201) # Check that the response status code is 201 CREATED
            response_json = response.get_json() # Extract the JSON data from the response    
            self.assertIn('message', response_json) # Ensure the 'message' key is in the response
            self.assertEqual(response_json['message'], expected_message) # Check that the response message contains the expected message
            self.assertIn('series_id', response_json) # Ensure the 'series_id' key is in the response
            self.assertEqual(len(response_json['series_id']), 36) # Check that the response message contains a 36 character series id

    def test_post_series_should_check_user_id(self):
        """Test confirms that POST /series will check user id"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            expected_message = 'Invalid user id'

            # Act
            response = self.client.post('/series', json={'created_by_user_id':'bad user id', 'recurrence':'weekly on monday'})

            # Assert
            self.assertEqual(response.status_code, 400) # Check that the response status code is 201 CREATED
            response_json = response.get_json() # Extract the JSON data from the response    
            self.assertIn('message', response_json) # Ensure the 'message' key is in the response
            self.assertEqual(response_json['message'], expected_message) # Check that the response message contains the expected message

    def test_post_series_should_check_recurrence(self):
        """Test confirms that POST /series will check recurrence"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            expected_message = 'Invalid recurrence type: bad recurrence, valid types are daily, weekly on monday, weekly on tuesday, weekly on wednesday, weekly on thursday, weekly on friday, weekly on saturday, weekly on sunday, monthly first monday, monthly first tuesday, monthly last monday, monthly last tuesday'

            # Act
            response = self.client.post('/series', json={'created_by_user_id':'04030201-0605-0807-0910-111213141500', 'recurrence':'bad recurrence'})

            # Assert
            self.assertEqual(response.status_code, 400) # Check that the response status code is 201 CREATED
            response_json = response.get_json() # Extract the JSON data from the response    
            self.assertIn('message', response_json) # Ensure the 'message' key is in the response
            self.assertEqual(response_json['message'], expected_message) # Check that the response message contains the expected message
    
    def test_post_event_should_check_user_id(self):
        """Test confirms that POST / will check user id"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            expected_message = 'Invalid user id'

            # Act
            response = self.client.post('/', json={'created_by_user_id':'bad user id', 'event_name':'event2','latitude':1,'longitude':1, 'event_date':'2024-07-27', 'genre_id':'04030201-0605-0807-0910-111213141544'})

            # Assert
            self.assertEqual(response.status_code, 400) # Check that the response status code is 201 CREATED
            response_json = response.get_json() # Extract the JSON data from the response    
            self.assertIn('message', response_json) # Ensure the 'message' key is in the response
            self.assertEqual(response_json['message'], expected_message) # Check that the response message contains the expected message

    def test_post_event_should_check_genre_id(self):
        """Test confirms that POST / will check genere id"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            expected_message = 'Invalid genre id'

            # Act
            response = self.client.post('/', json={'created_by_user_id':'04030201-0605-0807-0910-111213141500', 'event_name':'event2','latitude':1,'longitude':1, 'event_date':'2024-07-27', 'genre_id':'bad genre id'})

            # Assert
            self.assertEqual(response.status_code, 400) # Check that the response status code is 201 CREATED
            response_json = response.get_json() # Extract the JSON data from the response    
            self.assertIn('message', response_json) # Ensure the 'message' key is in the response
            self.assertEqual(response_json['message'], expected_message) # Check that the response message contains the expected message

    def test_post_event_should_create_event(self):
        """Test confirms that POST / will create a new event"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            expected_message = 'Event added successfully'
            expected_results = [
                {"event_name": "event2", "advert_type": "Text", "advert_text": "event2\n of 2024-07-27", "advert_image": None},
                {"event_name": "event0", "advert_type": "Text", "advert_text": None, "advert_image": None},
                {"event_name": "event1", "advert_type": "Text", "advert_text": None, "advert_image": None}
            ]

            # Act
            response = self.client.post('/', json={'created_by_user_id':'04030201-0605-0807-0910-111213141500', 'event_name':'event2', 'latitude':2, 'longitude':3, 'event_date':'2024-07-27', 'genre_id':'04030201-0605-0807-0910-111213141544'})

            # Assert
            self.assertEqual(response.status_code, 201) # Check that the response status code is 201 CREATED
            response_json = response.get_json() # Extract the JSON data from the response    
            self.assertIn('message', response_json) # Ensure the 'message' key is in the response
            self.assertEqual(response_json['message'], expected_message) # Check that the response message contains the expected message
            self.assertIn('event_id', response_json) # Ensure the 'series_id' key is in the response
            self.assertEqual(len(response_json['event_id']), 36) # Check that the response message contains a 36 character series id
            response = self.client.get('/0/100') # Make a GET request to the events endpoint
            self.assertIn(response.status_code, [200, 308]) # Check that the response status code is 200 OK, 308 redirect (redirect caused by pagination)
            actual_results = json.loads(response.data) # Parse the JSON response  
            for i in range(len(expected_results)):
                self.assertEqual(actual_results[i]['event_name'], expected_results[i]['event_name'])
                self.assertEqual(actual_results[i]['advert_type'], expected_results[i]['advert_type'])
                self.assertEqual(actual_results[i]['advert_text'], expected_results[i]['advert_text'])

if __name__ == '__main__':
    unittest.main()