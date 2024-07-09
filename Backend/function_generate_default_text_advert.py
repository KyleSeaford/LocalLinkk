import re

def generateDefaultTextAdvert(companyName, city, phoneNumber):    
    advert = companyName
    newline = "\n"

    if city != None and city != "":
        advert += f"{newline} of " + city
    
    if phoneNumber != None and phoneNumber != "" and is_valid_uk_phone_number(phoneNumber):
        advert += f"{newline}Call " + phoneNumber
    
    return advert

def is_valid_uk_phone_number(phone_number: str) -> bool:
    # Define the regex pattern for UK phone numbers allowing spaces
    pattern = re.compile(r'^(?:0|\+?44)\s?(\d\s?){9,10}$')
    return bool(pattern.match(phone_number))

