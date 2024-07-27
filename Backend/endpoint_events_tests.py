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
        cls.api = Api(cls.app, version='1.0', title='PI Firmware', description='Events Controller')
        cls.api.add_namespace(namespaceEvents, path='/')
        cls.client = cls.app.test_client()
        cls.app.config['TESTING'] = True

    def setUp(self):
        # Populate database with test data
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            self.db.execute("delete from events")           
            self.db.execute("INSERT INTO events (event_id, event_name, genre_id,latitude,longitude) VALUES ('04030201-0605-0807-0910-111213141511', 'event1', '04030201-0605-0807-0910-111213141520', 53.293571, -2.110140)")
            self.db.execute("delete from series")
            self.db.execute("insert into series (series_id, created_by_user_id, recurrence) values ('04030201-0605-0807-0910-111213141522', '04030201-0605-0807-0910-111213141533', 'weekly on monday')")

    def test_get_events(self):
        """Test confirms that GET / will return a list of all the events"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            expected_result = [
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

if __name__ == '__main__':
    unittest.main()