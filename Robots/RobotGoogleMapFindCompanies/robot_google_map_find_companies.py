import requests
import json
import os
from dotenv import load_dotenv
import re

# Load environment variables from .env file
load_dotenv()

# Define the URL for the POST request
POST_URL = 'http://192.168.127.223/Companies/company'

# Replace with your actual API key
API_KEY = str(os.getenv('google_map_api_key'))

# Base URL for the Places API
PLACES_API_BASE_URL = 'https://maps.googleapis.com/maps/api/place'

# Function to perform a nearby search for accountancy companies
def search_accountancy_companies(location, radius, keyword, api_key):
    url = f"{PLACES_API_BASE_URL}/nearbysearch/json"
    params = {
        'location': location,
        'radius': radius,
        'keyword': keyword,
        'key': api_key
    }
    response = requests.get(url, params=params)
    return response.json()

# Function to get detailed information for a specific place
def get_place_details(place_id, api_key):
    url = f"{PLACES_API_BASE_URL}/details/json"
    params = {
        'place_id': place_id,
        'key': api_key,
        'fields': 'name,formatted_address,geometry,website,formatted_phone_number'
    }
    response = requests.get(url, params=params)
    return response.json()

# Function to sanitize and shorten file names
def sanitize_filename(filename, max_length=255):
    # Remove invalid characters
    filename = re.sub(r'[<>:"/\\|?*]', '', filename)
    # Truncate the filename if it's too long
    if len(filename) > max_length:
        filename = filename[:max_length]
    return filename

# Main function to search and post companies
def find_and_post_companies(category_id, keyword, latitude, longitude, radius=50000):
    # Create the location string
    location = f'{latitude},{longitude}'
    
    # Perform the search
    search_results = search_accountancy_companies(location, radius, keyword, API_KEY)
    
    # Debugging: Print the entire search result
    print(json.dumps(search_results, indent=4))
    
    # Process each result to get detailed information
    companies = search_results.get('results', [])
    if not os.path.exists('companies'):
        os.makedirs('companies')
    
    print(f"Found {len(companies)} companies")
    for company in companies:
        place_id = company['place_id']
        details = get_place_details(place_id, API_KEY)
        result = details.get('result', {})
    
        # Debugging: Print details of each company
        print(json.dumps(result, indent=4))
    
        company_data = {
            'Company Name': result.get('name'),
            'Company Address': result.get('formatted_address'),
            'Latitude': result.get('geometry', {}).get('location', {}).get('lat'),
            'Longitude': result.get('geometry', {}).get('location', {}).get('lng'),
            'Company Email': None,  # Email is not typically available through Places API
            'Company Phone': result.get('formatted_phone_number'),
            'Company Website': result.get('website'),
            'Category Id': category_id,
            'google_maps_link': f"https://www.google.com/maps/place/?q=place_id:{place_id}"
        }
    
        # Sanitize the file name
        file_name = sanitize_filename(f"companies/{result.get('name').replace(' ', '_')}.json")
        print(f"Saving {file_name}")
        with open(file_name, 'w') as json_file:
            json.dump(company_data, json_file, indent=4)
    
        # Make the POST request
        response = requests.post(POST_URL, params=company_data)
        
        # Check the response
        if response.status_code == 201:
            print(f'Successfully added {result.get("name")}')
        else:
            print(f'Failed to add {result.get("name")}, Status Code: {response.status_code}, Response: {response.text}')
    
    print("Data collection complete.")

# Example usage
category_id = "baf4d641-8e04-4503-a1f0-36e0810a9036"
keyword = "Electrician"
latitude = 53.258663
longitude = -2.125939

find_and_post_companies(category_id, keyword, latitude, longitude)
