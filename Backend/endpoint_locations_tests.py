import unittest
import json
import os
from unittest.mock import patch
from flask import Flask
from flask_cors import CORS
from flask_restx import Api
from endpoint_locations import api as namespaceLocations
from database_extensions import database_extensions

class endpoint_companies_tests(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        """Set up for unit tests, executed once for the class"""
        
        # Create Postgres database for unit testing 
        db = database_extensions("")
        cls.unittest = db.create_database_and_tables("Backend\\database_schema.sql")

        # Populate database with test data
        with patch.dict(os.environ, {'dbDatabase': cls.unittest}):
            db.execute("insert into locations (id, name, region, country, ismajor, population, latitude, longitude) values ('22e94a57-e911-4d2e-94be-14d88cc20801','city1','North','UK','t',44444,0,0)")
            db.execute("insert into locations (id, name, region, country, ismajor, population, latitude, longitude) values ('22e94a57-e911-4d2e-94be-14d88cc20802','city2','East','UK','f',33333,0,0)")
            db.execute("insert into locations (id, name, region, country, ismajor, population, latitude, longitude) values ('22e94a57-e911-4d2e-94be-14d88cc20803','city3','West','UK','f',22222,0,0)")
            db.execute("insert into locations (id, name, region, country, ismajor, population, latitude, longitude) values ('22e94a57-e911-4d2e-94be-14d88cc20804','city4','South','USA','f',11111,0,0)")

        # Create the Flask test client
        cls.app = Flask(__name__)
        CORS(cls.app)  # Allow CORS for all routes
        cls.api = Api(cls.app, version='1.0', title='PI Firmware', description='Pi Side Firmware Controller')
        cls.api.add_namespace(namespaceLocations, path='/')
        cls.client = cls.app.test_client()
        cls.app.config['TESTING'] = True

    def test_get_all_locations(self):
        """Test that the locations endpoint returns all locations"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange
            expected_results = [
                {'id': '22e94a57-e911-4d2e-94be-14d88cc20801', 'name': 'city1', 'region': 'North', 'country': 'UK', 'ismajor': True, 'population': 44444, 'latitude': 0, 'longitude': 0},
                {'id': '22e94a57-e911-4d2e-94be-14d88cc20802', 'name': 'city2', 'region': 'East', 'country': 'UK', 'ismajor': False, 'population': 33333, 'latitude': 0, 'longitude': 0},
                {'id': '22e94a57-e911-4d2e-94be-14d88cc20803', 'name': 'city3', 'region': 'West', 'country': 'UK', 'ismajor': False, 'population': 22222, 'latitude': 0, 'longitude': 0},
                {'id': '22e94a57-e911-4d2e-94be-14d88cc20804', 'name': 'city4', 'region': 'South', 'country': 'USA', 'ismajor': False, 'population': 11111, 'latitude': 0, 'longitude': 0},
            ] 

            # Act
            response = self.client.get('/locations')

            # Assert
            self.assertEqual(response.status_code, 200)  # Check that the response status code is 200 OK
            actual_result = json.loads(response.data)  # Parse the JSON response        
            self.assertEqual(actual_result, expected_results)  # Check that the response contains the expected data

    def test_get_locations_by_population(self):
        """Test that the locations endpoint filters by population"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange
            expected_results = [
                {'id': '22e94a57-e911-4d2e-94be-14d88cc20801', 'name': 'city1', 'region': 'North', 'country': 'UK', 'ismajor': True, 'population': 44444, 'latitude': 0, 'longitude': 0},
                {'id': '22e94a57-e911-4d2e-94be-14d88cc20802', 'name': 'city2', 'region': 'East', 'country': 'UK', 'ismajor': False, 'population': 33333, 'latitude': 0, 'longitude': 0}
            ] 

            # Act
            response = self.client.get('/locations?population=22223')

            # Assert
            self.assertEqual(response.status_code, 200)  # Check that the response status code is 200 OK
            actual_result = json.loads(response.data)  # Parse the JSON response        
            self.assertEqual(actual_result, expected_results)  # Check that the response contains the expected data
        
    def test_get_locations_by_country(self):
        """Test that the locations endpoint filters by country"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange
            expected_results = [
                {'id': '22e94a57-e911-4d2e-94be-14d88cc20804', 'name': 'city4', 'region': 'South', 'country': 'USA', 'ismajor': False, 'population': 11111, 'latitude': 0, 'longitude': 0}
            ] 

            # Act
            response = self.client.get('/locations?country=USA')

            # Assert
            self.assertEqual(response.status_code, 200)  # Check that the response status code is 200 OK
            actual_result = json.loads(response.data)  # Parse the JSON response        
            self.assertEqual(actual_result, expected_results)  # Check that the response contains the expected data
    
    def test_get_locations_by_region(self):
        """Test that the locations endpoint filters by region"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange
            expected_results = [
                {'id': '22e94a57-e911-4d2e-94be-14d88cc20804', 'name': 'city4', 'region': 'South', 'country': 'USA', 'ismajor': False, 'population': 11111, 'latitude': 0, 'longitude': 0}
            ] 

            # Act
            response = self.client.get('/locations?region=South')

            # Assert
            self.assertEqual(response.status_code, 200)  # Check that the response status code is 200 OK
            actual_result = json.loads(response.data)  # Parse the JSON response        
            self.assertEqual(actual_result, expected_results)  # Check that the response contains the expected data
    
    def test_get_locations_by_major(self):
        """Test that the locations endpoint filters by major cities"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange
            expected_results = [
                {'id': '22e94a57-e911-4d2e-94be-14d88cc20801', 'name': 'city1', 'region': 'North', 'country': 'UK', 'ismajor': True, 'population': 44444, 'latitude': 0, 'longitude': 0}
            ] 

            # Act
            response = self.client.get('/locations?ismajor=true')

            # Assert
            self.assertEqual(response.status_code, 200)  # Check that the response status code is 200 OK
            actual_result = json.loads(response.data)  # Parse the JSON response        
            self.assertEqual(actual_result, expected_results)  # Check that the response contains the expected data
    
    def test_get_locations_by_minor(self):
        """Test that the locations endpoint filters by minor cities"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange
            expected_results = [
                {'id': '22e94a57-e911-4d2e-94be-14d88cc20802', 'name': 'city2', 'region': 'East', 'country': 'UK', 'ismajor': False, 'population': 33333, 'latitude': 0, 'longitude': 0},
                {'id': '22e94a57-e911-4d2e-94be-14d88cc20803', 'name': 'city3', 'region': 'West', 'country': 'UK', 'ismajor': False, 'population': 22222, 'latitude': 0, 'longitude': 0},
                {'id': '22e94a57-e911-4d2e-94be-14d88cc20804', 'name': 'city4', 'region': 'South', 'country': 'USA', 'ismajor': False, 'population': 11111, 'latitude': 0, 'longitude': 0}
            ] 

            # Act
            response = self.client.get('/locations?ismajor=false')

            # Assert
            self.assertEqual(response.status_code, 200)  # Check that the response status code is 200 OK
            actual_result = json.loads(response.data)  # Parse the JSON response        
            self.assertEqual(actual_result, expected_results)  # Check that the response contains the expected data

if __name__ == '__main__':
    unittest.main()
