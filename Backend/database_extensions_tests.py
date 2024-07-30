import unittest
import os
from unittest.mock import patch
from database_extensions import database_extensions

class database_extensions_tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Set up for unit tests, function is executed before tests begin"""

        # Create Postgres database for unit testing 
        cls.db = database_extensions()
        cls.unittest = cls.db.create_database_and_tables("Backend\\database_schema.sql")

    def setUp(self):
        # Populate database with test data
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            self.db.execute("delete from settings")
            self.db.execute("INSERT INTO Settings (Sname, Svalue) VALUES ('Setting1', 'Value1')")
            self.db.execute("INSERT INTO Settings (Sname, Svalue) VALUES ('Setting2', 'Value2')")

    def test_fetchAll(self):
        """Test confirms that FetchAll will return a list of all the system settings"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            expected_result = [
                ('Setting1', 'Value1'),
                ('Setting2', 'Value2')
            ]
            systemUnderTest = database_extensions()

            # Act
            actual_result = systemUnderTest.fetchAll('SELECT Sname, Svalue FROM Settings ORDER BY Sname ASC')

            # Assert      
            self.assertEqual(actual_result, expected_result) 
    
    def test_fetchSingleValue(self):
        """Test confirms that fetchSingleValue will return a single system setting value"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            expected_result = 'Value1'
            systemUnderTest = database_extensions()

            # Act
            actual_result = systemUnderTest.fetchSingleValue("SELECT Svalue FROM Settings where Sname='Setting1'")

            # Assert      
            self.assertEqual(actual_result, expected_result) 
    
    def test_fetchSingleValue_no_record_found(self):
        """Test confirms that fetchSingleValue raise exception when the value is not found"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            systemUnderTest = database_extensions()

            # Act and Assert
            with self.assertRaises(Exception) as context:
                systemUnderTest.fetchSingleValue("SELECT Svalue FROM Settings where Sname='bad'")        
            self.assertEqual(str(context.exception), "No record found") # Assert that the exception message is "No record found"
    
    def test_fetchSingleValue_too_many_records_found(self):
        """Test confirms that fetchSingleValue raise exception when too many records are found"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            systemUnderTest = database_extensions()

            # Act and Assert
            with self.assertRaises(Exception) as context:
                systemUnderTest.fetchSingleValue("SELECT Svalue FROM Settings")        
            self.assertEqual(str(context.exception), "More than one record found") # Assert that the exception message is "More than one record found"
    
    def test_execute(self):
        """Text confirms that execute can insert a record"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            name = 'Setting5'
            value = 'Value5'
            expected_result = [
                ('Setting1', 'Value1'),
                ('Setting2', 'Value2'),
                (name, value)
            ]
            systemUnderTest = database_extensions()

            # Act
            systemUnderTest.execute(f"INSERT INTO Settings (Sname, Svalue) VALUES ('{name}', '{value}')")

            # Assert
            actual_result = systemUnderTest.fetchAll('SELECT Sname, Svalue FROM Settings ORDER BY Sname ASC')
            self.assertEqual(actual_result, expected_result) 

    def test_fetchJson(self):
        """Test confirms that FetchAll will return a list of all the system settings"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            expected_result = [
                {'Sname': 'Setting1', 'Svalue': 'Value1'},
                {'Sname': 'Setting2', 'Svalue': 'Value2'}
            ]
            systemUnderTest = database_extensions()

            # Act
            actual_result = systemUnderTest.fetchJson(['Sname', 'Svalue'], 'Settings', '', 'ORDER BY Sname ASC')

            # Assert      
            self.assertEqual(actual_result, expected_result) 
    
    def test_generateId_length_check(self):
        """Test confirms that generateId will create an id number that is 36 characters in length"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            systemUnderTest = database_extensions()

            # Act
            actual_result = systemUnderTest.generateId()

            # Assert      
            self.assertEqual(len(actual_result), 36) 
    
    def test_generateId_unique_check(self):
        """Test confirms that generateId will create unique id numbers"""
        with patch.dict(os.environ, {'dbDatabase': self.unittest}):
            # Arrange 
            systemUnderTest = database_extensions()
            actual_results = []

            # Act
            for i in range(10):
                actual_results.append(systemUnderTest.generateId())

            # Assert      
            self.assertEqual(len(actual_results), len(set(actual_results)), "generateId did not produce unique IDs")
    
    def test_single_quote(self):
        # Arrange 
        systemUnderTest = database_extensions()

        # Act
        result = systemUnderTest.makeSafe("This is a test's input")

        # Assert
        self.assertEqual(result, "This is a test\'s input")

    def test_double_quote(self):
        # Arrange 
        systemUnderTest = database_extensions()

        # Act
        result = systemUnderTest.makeSafe('This is a test "input"')

        # Assert
        self.assertEqual(result, 'This is a test \\\"input\\\"')

    def test_both_quotes(self):
        # Arrange 
        systemUnderTest = database_extensions()

        # Act
        result = systemUnderTest.makeSafe('Test with both " and \' characters')

        # Assert
        self.assertEqual(result, 'Test with both \\\" and \' characters')

    def test_no_quotes(self):
        # Arrange 
        systemUnderTest = database_extensions()

        # Act
        result = systemUnderTest.makeSafe("No special characters")

        # Assert
        self.assertEqual(result, "No special characters")

    def test_empty_string(self):
        # Arrange 
        systemUnderTest = database_extensions()

        # Act
        result = systemUnderTest.makeSafe("")

        # Assert
        self.assertEqual(result, "")

if __name__ == '__main__':
    unittest.main()