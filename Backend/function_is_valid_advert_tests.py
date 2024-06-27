import unittest
from function_is_valid_advert import is_valid_advert

class TestIsValidAdvert(unittest.TestCase):

    def test_valid_advert(self):
        self.assertTrue(is_valid_advert("This is a valid advert text."))

    def test_too_long_advert(self):
        long_text = "a" * 101
        self.assertFalse(is_valid_advert(long_text))

    def test_contains_email(self):
        self.assertFalse(is_valid_advert("Contact us at example@example.com"))

    def test_contains_website(self):
        self.assertFalse(is_valid_advert("Visit our website at http://example.com"))

    def test_contains_swear_word(self):
        self.assertFalse(is_valid_advert("This advert contains swear1 word"))

    def test_combined_invalid_cases(self):
        invalid_text = "This advert contains swear1 word and an email example@example.com"
        self.assertFalse(is_valid_advert(invalid_text))

    def test_edge_case_empty_string(self):
        self.assertTrue(is_valid_advert(""))

    def test_edge_case_exactly_100_characters(self):
        text = "a" * 100
        self.assertTrue(is_valid_advert(text))

    def test_case_insensitive_swear_word(self):
        self.assertFalse(is_valid_advert("This advert contains Swear1 word"))

if __name__ == '__main__':
    unittest.main()
