import re

def is_valid_advert(text):
    # Check if the text is longer than 100 characters
    if len(text) > 100:
        return False

    # Regular expression patterns for email and website addresses
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    website_pattern = r'\b(https?://|www\.)[^\s/$.?#].[^\s]*\b'

    # Check for email addresses
    if re.search(email_pattern, text):
        return False

    # Check for website addresses
    if re.search(website_pattern, text):
        return False

    # List of swear words (example list, can be extended)
    swear_words = ['swear1', 'swear2', 'swear3']  # Replace with actual swear words

    # Check for swear words
    for swear_word in swear_words:
        if swear_word.lower() in text.lower():
            return False

    # If all checks pass, return True
    return True
