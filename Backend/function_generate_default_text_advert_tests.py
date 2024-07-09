import unittest
from function_generate_default_text_advert import *

class TestIsValidAdvert(unittest.TestCase):
    
    def test_just_company_name_advert(self):
        # Arrange 
        companyName = "Bob and Co"
        city = ""
        phone = ""

        # Act
        result = generateDefaultTextAdvert(companyName, city, phone)

        # Assert
        self.assertEqual(companyName, result)

    def test_company_name_and_city_advert(self):
        # Arrange 
        companyName = "Bob and Co"
        city = "Macclesfield"
        phone = ""

        # Act
        result = generateDefaultTextAdvert(companyName, city, phone)

        # Assert
        self.assertIn(companyName, result)
        self.assertIn(city, result)
    
    def test_company_name_and_phone_advert(self):
        # Arrange 
        companyName = "Bob and Co"
        city = ""
        phone = "01625 611979"

        # Act
        result = generateDefaultTextAdvert(companyName, city, phone)

        # Assert
        self.assertIn(companyName, result)
        self.assertIn(phone, result)

    def test_company_name_and_city_and_phone_advert(self):
        # Arrange 
        companyName = "Bob and Co"
        city = "Macclesfield"
        phone = "01625 611979"

        # Act
        result = generateDefaultTextAdvert(companyName, city, phone)

        # Assert
        self.assertIn(companyName, result)
        self.assertIn(city, result)
        self.assertIn(phone, result)

    def test_valid_landline_numbers(self):
        self.assertTrue(is_valid_uk_phone_number("01234567890"))
        self.assertTrue(is_valid_uk_phone_number("020 7946 0123"))
        self.assertTrue(is_valid_uk_phone_number("02079460123"))
        self.assertTrue(is_valid_uk_phone_number("+44 1234 567890"))
        self.assertTrue(is_valid_uk_phone_number("+441234567890"))
        self.assertTrue(is_valid_uk_phone_number("01625 611979"))

    def test_valid_mobile_numbers(self):
        self.assertTrue(is_valid_uk_phone_number("07123456789"))
        self.assertTrue(is_valid_uk_phone_number("07 123 456 789"))
        self.assertTrue(is_valid_uk_phone_number("+44 7123 456789"))
        self.assertTrue(is_valid_uk_phone_number("+447123456789"))

    def test_invalid_phone_numbers(self):
        self.assertFalse(is_valid_uk_phone_number("1234567890"))  # Missing leading zero or +44
        self.assertFalse(is_valid_uk_phone_number("07890 1234567"))  # Too many digits
        self.assertFalse(is_valid_uk_phone_number("07890 1234"))  # Too few digits
        self.assertFalse(is_valid_uk_phone_number("0800 123 45"))  # Too few digits for landline

    def test_non_numeric_characters(self):
        self.assertFalse(is_valid_uk_phone_number("07a23456789"))  # Alphabetic character
        self.assertFalse(is_valid_uk_phone_number("07-23456789"))  # Hyphen

if __name__ == '__main__':
    unittest.main()