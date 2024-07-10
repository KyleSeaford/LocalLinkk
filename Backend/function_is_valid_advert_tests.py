import unittest
from function_is_valid_advert import *

class TestIsValidAdvert(unittest.TestCase):

    def test_isAdvertTooLong_TextTooLong(self):
        ### Text confirms if the advert is too long ###

        # Arrange
        long_text = "a" * 101

        # Act
        result = isAdvertTooLong(long_text, 100)

        # Assert
        self.assertTrue(result)

    def test_isAdvertTooLong_okLength(self):
        ### Text confirms if the advert is too long ###

        # Arrange
        short_text = "a" * 50

        # Act
        result = isAdvertTooLong(short_text, 100)

        # Assert
        self.assertFalse(result)

    def test_isEmailInAdvert_containsEmail(self):
        ### Text confirms isEmailInAdvert can find email in advert ##

        # Arrange
        text = "Contact us at example@example.com"

        # Act
        result = isEmailInAdvert(text)

        # Assert
        self.assertTrue(result)
    
    def test_isEmailInAdvert_doesNotContainsEmail(self):
        ### Text confirms isEmailInAdvert can find email in advert ##

        # Arrange
        text = "This is a valid advert text."

        # Act
        result = isEmailInAdvert(text)

        # Assert
        self.assertFalse(result)

    def test_isWebAddressInAdvert_containsLink(self):
        ### Text confirms isEmailInAdvert can find link in advert ##

        # Arrange
        text = "Visit our website at http://example.com"

        # Act
        result = isWebAddressInAdvert(text)

        # Assert
        self.assertTrue(result)
    
    def test_isWebAddressInAdvert_doesNotContainsLink(self):
        ### Text confirms isEmailInAdvert can find link in advert ##

        # Arrange
        text = "This is a valid advert text."

        # Act
        result = isWebAddressInAdvert(text)

        # Assert
        self.assertFalse(result)

    def test_isSwearWordInAdvert_containsSwear(self):
        ### Text confirms isSwearWordInAdvert can find swear in advert ##

        # Arrange
        text = "This advert contains ass word"

        # Act
        result = isSwearWordInAdvert(text)

        # Assert
        self.assertEqual("ass", result)
    
    def test_isSwearWordInAdvert_doesNotContainsSwear(self):
        ### Text confirms isSwearWordInAdvert can find swear in advert ##

        # Arrange
        text = "This is a valid advert text."

        # Act
        result = isSwearWordInAdvert(text)

        # Assert
        self.assertEqual("", result)

    def test_is_valid_basic_advert_containsSwearAndEmail(self):
        ### Text confirms is_valid_basic_advert will return a list of validation issues ###

        # Arrange 
        text = "This advert contains ass word and an email example@example.com"

        # Act
        result = is_valid_basic_advert(text)

        # Assert
        self.assertEqual(2, len(result))
        self.assertEqual("Basic advert must not contain an email address", result[0])
        self.assertEqual("Advert must not contain word ass", result[1])

    def test_is_valid_basic_advert_containsIsValid(self):
        ### Text confirms is_valid_basic_advert will return a list of validation issues ###

        # Arrange 
        text = "This is a valid advert text."

        # Act
        result = is_valid_basic_advert(text)

        # Assert
        self.assertEqual(0, len(result))

    def test_is_valid_custom_advert_containsSwear(self):
        ### Text confirms is_valid_custom_advert will return a list of validation issues ###

        # Arrange 
        text = "This advert contains ass word and an email example@example.com"

        # Act
        result = is_valid_custom_advert(text)

        # Assert
        self.assertEqual(1, len(result))
        self.assertEqual("Advert must not contain word ass", result[0])


    def test_is_valid_custom_advert_containsIsValid(self):
        ### Text confirms is_valid_custom_advert will return a list of validation issues ###

        # Arrange 
        text = "This is a valid advert text."

        # Act
        result = is_valid_custom_advert(text)

        # Assert
        self.assertEqual(0, len(result))

if __name__ == '__main__':
    unittest.main()
