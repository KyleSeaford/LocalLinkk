import re
from datetime import datetime

def is_valid_uk_phone_number(phone_number: str) -> bool:
    # Define the regex pattern for UK phone numbers allowing spaces
    pattern = re.compile(r'^(?:0|\+?44)\s?(\d\s?){9,10}$')
    return bool(pattern.match(phone_number))


# default company advert
def generateDefaultTextAdvert(companyName, city, phoneNumber):    
    advert = companyName
    newline = "\n"

    if city != None and city != "":
        advert += f"{newline} of " + city
    
    if phoneNumber != None and phoneNumber != "" and is_valid_uk_phone_number(phoneNumber):
        advert += f"{newline}Call " + phoneNumber
    
    return advert

# custom company advert
def generateTextAdvert(companyName, Text, link):
    advert = companyName
    newline = "\n"

    if Text != None and Text != "":
        advert += f"{newline}{Text}"

    if link != None and link != "":
        advert += f"{newline}Visit " + link
    
    return advert

def generateDefaultEventAdvert(eventName, companyName, date, phoneNumber, description):
    advert = f"{eventName} by {companyName}"
    newline = "\n"

    if date:
        # Format the date as "dd mmm yyyy"
        date_str = date.strftime('%d %b %Y')
        
        # Check if the time is not 00:00:00
        if date.time() != datetime.min.time():
            date_str += f" at {date.strftime('%H:%M:%S')}"
        
        advert += f"{newline} on {date_str}"
    
    if phoneNumber and is_valid_uk_phone_number(phoneNumber):
        advert += f"{newline}Call {phoneNumber}"

    if description:
        advert += f"{newline}{description}"
    
    return advert