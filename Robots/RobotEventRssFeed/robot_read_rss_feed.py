import feedparser
import logging
import os
import requests
from database_extensions import database_extensions
from dotenv import load_dotenv
from function_generate_default_text_advert import generateDefaultEventAdvert

load_dotenv()
logging.basicConfig(level=os.getenv("logLevel"), format=str(os.getenv("logFormat")), filename=os.getenv("logFilename")) 

def findSeenEntries(companyId):
    seenEntries = []
    for event in database_extensions().fetchAll(f"SELECT rss_event_id FROM events where company_id='{companyId}'"):
        seenEntries.append(event[0])
    return seenEntries

def readRssFeeds():
    for r in database_extensions().fetchAll("SELECT company_id, company_name, phone, website, email, longitude, latitude, rss_genre_id, rss_url FROM companies where rss_url is NOT NULL order by rss_last_read LIMIT 100"):
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
        logging.info(f"Finding previous rss event entries for company {companyId}")
        seenEntries = findSeenEntries(companyId)
        logging.info(f"Found {len(seenEntries)} previous rss events") 

        # Parse the RSS feed
        logging.info(f"Reading RSS feed for company {companyName} rss feed {rssUrl}")
        feed = feedparser.parse(rssUrl)
        for entry in feed.entries:
            if entry.id not in seenEntries:
                print("="*20)
                logging.info(f"{entry.id} is a new event")                
                print("entry=", entry)
                print(f"**Title: {entry.title}")
                print(f"**Link: {entry.link}")
                print(f"**Published: {entry.published}")
                print(f"**Summary: {entry.summary}\n")

                webLink = entry.link
                if webLink is None or webLink == "":
                    # If the event link is empty use the company website
                    webLink = companyWebsite

                advertText = generateDefaultEventAdvert(entry.title, companyName, entry.published, companyPhone, entry.summary)

                json={
                        'created_by_user_id':'19d035c5-b5d0-4719-baa9-5e58450018e1', 
                        'event_name':entry.title, 
                        'latitude':companyLatitude, 
                        'longitude':companyLongitude, 
                        'event_date':entry.published, 
                        'genre_id':rssGenreId,
                        'phone':companyPhone,
                        'website':webLink,
                        'company_id': companyId,
                        'advert_type':'TEXT',
                        'advert_text': advertText,
                        'rss_event_id': entry.id
                    }
                
                logging.info(f"JSON for Event POST {json}")
                response = requests.post('http://192.168.127.223/events', json)
                logging.info(f"Response Status={response.status_code}, Message={response}")

if __name__ == '__main__':
    logging.info("=== Application Start ===")
    try:
        readRssFeeds()
        logging.info("=== Application Finished ===")
    except Exception as ex:
        logging.error(f"ERROR in application: {ex}")
