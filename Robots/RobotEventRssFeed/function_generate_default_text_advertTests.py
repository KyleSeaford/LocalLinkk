import unittest
from datetime import datetime
from function_generate_default_text_advert import generateDefaultEventAdvert

class TestGenerateDefaultEventAdvert(unittest.TestCase):
    
    def test_event_date_with_time_conversion_to_string(self):
        # Arrange
        eventName = "Sample Event"
        companyName = "Sample Company"
        date = datetime(2024, 8, 16, 18, 30)  # Example datetime with time
        phoneNumber = "07123456789"
        description = "This is a sample event description."
        
        # Act
        advert = generateDefaultEventAdvert(eventName, companyName, date, phoneNumber, description)
        
        # Assert
        expected_date_str = date.strftime('%d %b %Y at %H:%M:%S')
        self.assertIn(expected_date_str, advert, "The date and time should be correctly formatted and included in the advert.")

    def test_event_date_without_time_conversion_to_string(self):
        # Arrange
        eventName = "Sample Event"
        companyName = "Sample Company"
        date = datetime(2024, 8, 16, 0, 0)  # Example datetime with time set to 00:00:00
        phoneNumber = "07123456789"
        description = "This is a sample event description."
        
        # Act
        advert = generateDefaultEventAdvert(eventName, companyName, date, phoneNumber, description)
        
        # Assert
        expected_date_str = date.strftime('%d %b %Y')
        self.assertIn(expected_date_str, advert, "The date should be correctly formatted and included in the advert.")
        self.assertNotIn('00:00:00', advert, "The time should not be included when it is 00:00:00.")

if __name__ == '__main__':
    unittest.main()

