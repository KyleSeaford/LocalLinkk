import requests
import json
import os
from dotenv import load_dotenv
import re
import time

# Load environment variables from .env file
load_dotenv()

# Define the URLs for the GET and POST requests
CATEGORIES_URL = 'http://192.168.127.93:5500/Categories/categories'
POST_URL = 'http://192.168.127.223/Companies/company'

# Replace with your actual API key
API_KEY = str(os.getenv('google_map_api_key'))

# Base URL for the Places API
PLACES_API_BASE_URL = 'https://maps.googleapis.com/maps/api/place'

# Directory to save company JSON files
COMPANY_DIR = 'Z:/samba/LocalLinkk/companies'

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
    if not os.path.exists(COMPANY_DIR):
        os.makedirs(COMPANY_DIR)
    
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
        file_name = sanitize_filename(f"{result.get('name').replace(' ', '_')}.json")
        file_path = os.path.join(COMPANY_DIR, file_name)
        print(f"Saving {file_path}")
        with open(file_path, 'w') as json_file:
            json.dump(company_data, json_file, indent=4)
    
        # Make the POST request
        response = requests.post(POST_URL, json=company_data)
        
        # Check the response
        if response.status_code == 201:
            print(f'Successfully added {result.get("name")}')
        else:
            print(f'Failed to add {result.get("name")}, Status Code: {response.status_code}, Response: {response.text}')
    
    print("Data collection complete.")

# Function to fetch categories
def fetch_categories(url):
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        print(f'Failed to fetch categories, Status Code: {response.status_code}, Response: {response.text}')
        return []

# Function to track progress
def load_progress(filename):
    if os.path.exists(filename):
        with open(filename, 'r') as file:
            return set(json.load(file))
    return set()

def save_progress(filename, done_categories):
    with open(filename, 'w') as file:
        json.dump(list(done_categories), file)

def main():
    # Fetch categories
    categories = fetch_categories(CATEGORIES_URL)
    
    # Load progress
    progress_file = 'progress.json'
    done_categories = load_progress(progress_file)
    
    # Example latitude and longitude
    latitude = 53.258663
    longitude = -2.125939
    
    # Process categories
    for category in categories:
        category_id = category['category_id']
        category_name = category['category_name']
        parent_category_id = category['parent_category_id']
        
        if parent_category_id != "0" and category_id not in done_categories:
            try:
                find_and_post_companies(category_id, category_name, latitude, longitude)
                done_categories.add(category_id)
                save_progress(progress_file, done_categories)
            except Exception as e:
                print(f'Error processing category {category_name}: {e}')
                save_progress(progress_file, done_categories)
                # If API limit is reached, wait before continuing
                time.sleep(60 * 15)

if __name__ == "__main__":
    main()
