import feedparser
import requests
import re
from start_logging import *
from database_extensions import database_extensions
from datetime import datetime
from function_generate_default_text_advert import generateDefaultEventAdvert

def find_event_date(title, description, pubdate):
    try:
        eventDate = extract_datetime(title)
    except:
        try:
            eventDate = extract_datetime(description)
        except:
            eventDate = pubdate
    return eventDate

def extract_datetime(event_string: str) -> datetime:
    # List of regular expression patterns to match date and time
    date_time_patterns = [
        # Handles formats like "7th Oct 2024" or "7 Oct 2024"
        r'(\d{1,2})(?:st|nd|rd|th)? (\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\b) (\d{4})',
        # Handles formats like "Wednesday 21st August 19.15 - 20.30pm"
        r'(\b(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b) (\d{1,2})(?:st|nd|rd|th) (\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\b) (\d{2})\.(\d{2})',
        # Add other patterns here as needed
    ]
    
    for pattern in date_time_patterns:
        match = re.search(pattern, event_string)
        if match:
            if len(match.groups()) == 3:  # This handles the day-month-year format
                day = int(match.group(1))
                month = match.group(2)
                year = int(match.group(3))
                # Convert month name (abbreviated or full) to month number
                month_number = datetime.strptime(month, '%b').month if len(month) <= 3 else datetime.strptime(month, '%B').month
                date_time_obj = datetime(year, month_number, day)
                return date_time_obj
            elif len(match.groups()) == 5:  # This handles the full date-time format
                day_of_week = match.group(1)
                day = int(match.group(2))
                month = match.group(3)
                hour = int(match.group(4))
                minute = int(match.group(5))
                month_number = datetime.strptime(month, '%B').month
                current_year = datetime.now().year
                date_time_obj = datetime(current_year, month_number, day, hour, minute)
                return date_time_obj
    
    raise ValueError("No matching date and time format found in the string.")

def findSeenEntries(companyId):
    seenEntries = []
    for event in database_extensions().fetchAll(f"SELECT rss_event_id FROM events where company_id='{companyId}'"):
        seenEntries.append(event[0])
    return seenEntries

def readRssFeeds():
    for r in database_extensions().fetchAll("SELECT company_id, company_name, phone, website, email, longitude, latitude, rss_genre_id, rss_url FROM companies where rss_url is NOT NULL order by rss_last_read LIMIT 1000"):
        try:
            companyId = r[0]
            companyName = r[1]
            companyPhone = r[2]
            companyWebsite = r[3]
            companyEmail = r[4]
            companyLongitude = r[5]
            companyLatitude = r[6]
            rssGenreId = r[7]
            rssUrl = r[8]
            
            # Finding previous rss event entries
            log(f"Finding previous rss event entries for company {companyId}")
            seenEntries = findSeenEntries(companyId)
            log(f"Found {len(seenEntries)} previous rss events") 

            # Parse the RSS feed
            log(f"Reading RSS feed for company {companyName} rss feed {rssUrl}")
            feed = feedparser.parse(rssUrl)
            log(f"Found {len(feed.entries)} in rss feed")
            for entry in feed.entries:
                try:
                    if entry.id not in seenEntries:
                        log("="*20)
                        log(f"{entry.id} is a new event")                
                        log("entry={entry}")
                        log(f"**Title: {entry.title}")
                        log(f"**Link: {entry.link}")
                        log(f"**Published: {entry.published}")
                        log(f"**Summary: {entry.summary}\n")

                        webLink = entry.link
                        if webLink is None or webLink == "":
                            # If the event link is empty use the company website
                            webLink = companyWebsite

                        log("Finding event date")
                        eventDate = find_event_date(entry.title, entry.summary, entry.published)
                        log(f"Found event date = {eventDate}")

                        log("Generating advert")
                        advertText = generateDefaultEventAdvert(entry.title, companyName, eventDate, companyPhone, entry.summary)
                        log(f"Generated advert = {advertText}")

                        json={
                                'created_by_user_id':'19d035c5-b5d0-4719-baa9-5e58450018e1', 
                                'event_name':entry.title, 
                                'latitude':companyLatitude, 
                                'longitude':companyLongitude, 
                                'event_date':str(eventDate), 
                                'genre_id':rssGenreId,
                                'phone':companyPhone,
                                'website':webLink,
                                'company_id': companyId,
                                'advert_type':'Text',
                                'advert_text': advertText,
                                'rss_event_id': entry.id
                            }
                        
                        log(f"JSON for Event POST {json}")
                        response = requests.post('http://192.168.127.223/Events', json=json)
                        log(f"Response Status={response.status_code}")
                        try:
                            response_data = response.json()
                            log(f"Response JSON={response_data}")
                        except ValueError:
                            # Response is not in JSON format, print raw text
                            response_data = response.text
                            log(f"Response Text={response_data}")
                except Exception as ex:
                    error("Failed to process new entry",ex)
        except Exception as ex:
            error("Failed to process RSS feed", ex)                    

if __name__ == '__main__':
    log("=== Application Start ===")
    try:
        readRssFeeds()
        log("=== Application Finished ===")
    except Exception as ex:
        error("ERROR in application", ex)