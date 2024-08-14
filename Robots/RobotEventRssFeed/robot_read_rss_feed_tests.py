import unittest
from datetime import datetime
from robot_read_rss_feed import extract_datetime, find_event_date

class TestExtractDatetime(unittest.TestCase):
    def test_extract_datetime(self):
        # Arrange
        event_string = "Special Constable Information Evening -St Andrews Church, Orford - Wednesday 21st August 19.15 - 20.30pm"
        expected_datetime = datetime(datetime.now().year, 8, 21, 19, 15)  # assuming the current year

        # Act
        actual_datetime = extract_datetime(event_string)

        # Assert
        self.assertEqual(actual_datetime, expected_datetime)

    def test_extract_datetime_different_date(self):
        # Arrange
        event_string = "Community Meeting - Main Hall - Friday 12th July 18.30 - 20.00pm"
        expected_datetime = datetime(datetime.now().year, 7, 12, 18, 30)  # assuming the current year

        # Act
        actual_datetime = extract_datetime(event_string)

        # Assert
        self.assertEqual(actual_datetime, expected_datetime)

    def test_no_match_found(self):
        # Arrange
        event_string = "Event without a valid date and time"

        # Act & Assert
        with self.assertRaises(ValueError):
            extract_datetime(event_string)
    
    def test_find_event_date_from_title(self):
        # Arrange
        title = "Special Constable Information Evening - Wednesday 21st August 19.15 - 20.30pm"
        description = "This event will be held at St Andrews Church, Orford."
        pubdate = datetime(2024, 8, 1, 10, 0)

        expected_datetime = datetime(2024, 8, 21, 19, 15)

        # Act
        actual_datetime = find_event_date(title, description, pubdate)

        # Assert
        self.assertEqual(actual_datetime, expected_datetime)

    def test_find_event_date_from_description(self):
        # Arrange
        title = "Special Constable Information Evening"
        description = "This event will be held on Wednesday 21st August 19.15 - 20.30pm at St Andrews Church, Orford."
        pubdate = datetime(2024, 8, 1, 10, 0)

        expected_datetime = datetime(2024, 8, 21, 19, 15)

        # Act
        actual_datetime = find_event_date(title, description, pubdate)

        # Assert
        self.assertEqual(actual_datetime, expected_datetime)

    def test_find_event_date_from_pubdate(self):
        # Arrange
        title = "Special Constable Information Evening"
        description = "This event will be held at St Andrews Church, Orford."
        pubdate = datetime(2024, 8, 1, 10, 0)

        expected_datetime = pubdate

        # Act
        actual_datetime = find_event_date(title, description, pubdate)

        # Assert
        self.assertEqual(actual_datetime, expected_datetime)

    def test_no_date_in_title_or_description(self):
        # Arrange
        title = "Special Constable Information Evening"
        description = "Join us for an informative evening at St Andrews Church."
        pubdate = datetime(2024, 8, 1, 10, 0)

        expected_datetime = pubdate

        # Act
        actual_datetime = find_event_date(title, description, pubdate)

        # Assert
        self.assertEqual(actual_datetime, expected_datetime)

# Run the tests
if __name__ == "__main__":
    unittest.main(argv=[''], exit=False)