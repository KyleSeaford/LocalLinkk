import os
import json
import requests
from dotenv import load_dotenv
import re

# Load environment variables from .env file
load_dotenv()

# Directory containing the company JSON files
COMPANY_DIR = 'Z:/samba/LocalLinkk/companies'

# Base URLs for updating company details and retrieving all companies
UPDATE_URL = 'http://192.168.127.93:5500/Companies/company'
GET_ALL_COMPANIES_URL = 'http://192.168.127.93:5500/Companies/companies'

# Function to sanitize and shorten file names
def sanitize_filename(filename, max_length=255):
    # Remove invalid characters
    filename = re.sub(r'[<>:"/\\|?*]', '', filename)
    # Truncate the filename if it's too long
    if len(filename) > max_length:
        filename = filename[:max_length]
    return filename

# Function to get all companies
def get_all_companies():
    response = requests.get(GET_ALL_COMPANIES_URL)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to retrieve companies, Status Code: {response.status_code}, Response: {response.text}")
        return []

# Function to find company ID by name
def find_company_id_by_name(companies, company_name):
    for company in companies:
        if company['company_name'].strip().lower() == company_name.strip().lower():
            return company['company_id']
    return None

# Function to update JSON files and send PUT request
def update_company_files_and_database():
    # Retrieve all companies
    companies = get_all_companies()
    if not companies:
        print("No companies retrieved from the database.")
        return

    # Get the list of JSON files in the directory
    json_files = [f for f in os.listdir(COMPANY_DIR) if f.endswith('.json')]
    
    if not json_files:
        print(f"No JSON files found in directory: {COMPANY_DIR}")
        return
    
    for filename in json_files:
        file_path = os.path.join(COMPANY_DIR, filename)
        try:
            with open(file_path, 'r') as file:
                company_data = json.load(file)

            # Debug: Show company data before update
            print(f"Processing file: {filename}")
            print(f"Current company data: {json.dumps(company_data, indent=4)}")

            # Ensure 'google_maps_link' is present and correct
            if not company_data.get('google_maps_link'):
                # Create google_maps_link from place_id if available
                if 'Latitude' in company_data and 'Longitude' in company_data:
                    place_id = company_data.get('Place ID', 'Unknown Place ID')
                    google_maps_link = f"https://www.google.com/maps/place/?q=place_id:{place_id}"
                    company_data['google_maps_link'] = google_maps_link

                    # Update the JSON file
                    with open(file_path, 'w') as file:
                        json.dump(company_data, file, indent=4)

            # Get the company ID using the company name
            company_name = company_data.get('Company Name')
            if company_name:
                company_id = find_company_id_by_name(companies, company_name)
                if company_id:
                    # Send PUT request to update the database
                    put_url = f"{UPDATE_URL}/{company_id}"
                    response = requests.put(put_url, json={"Google Maps Link": company_data['google_maps_link']})
                    
                    # Check the response
                    if response.status_code == 200:
                        print(f'Successfully updated {company_name} with Google Maps Link')
                    else:
                        print(f'Failed to update {company_name}, Status Code: {response.status_code}, Response: {response.text}')
                else:
                    print(f'No valid company ID found for company name: {company_name}')
            else:
                print(f'No company name found in file: {filename}')
        except Exception as e:
            print(f"Error processing file {filename}: {e}")

if __name__ == "__main__":
    update_company_files_and_database()
