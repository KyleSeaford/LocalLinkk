import requests
from collections import defaultdict

# Base URLs for retrieving and deleting companies
GET_ALL_COMPANIES_URL = 'http://192.168.127.93:5500/Companies/companies'
DELETE_COMPANY_URL = 'http://192.168.127.93:5500/Companies/company'

# Function to get all companies
def get_all_companies():
    response = requests.get(GET_ALL_COMPANIES_URL)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to retrieve companies, Status Code: {response.status_code}, Response: {response.text}")
        return []

# Function to delete a company by ID
def delete_company(company_id):
    delete_url = f"{DELETE_COMPANY_URL}/{company_id}"
    response = requests.delete(delete_url)
    return response.status_code == 204  # 204 No Content indicates successful deletion

# Function to find and remove duplicates
def remove_duplicates():
    # Retrieve all companies
    companies = get_all_companies()
    if not companies:
        print("No companies retrieved from the database.")
        return

    # Dictionary to track unique companies and duplicates
    company_dict = defaultdict(list)
    
    # Populate the dictionary with company names as keys and their data as values
    for company in companies:
        company_name = company['company_name'].strip().lower()
        company_dict[company_name].append(company)
    
    # Identify and remove duplicates
    for company_name, company_list in company_dict.items():
        if len(company_list) > 1:
            print(f"Found duplicates for company: {company_name}")
            # Keep the first instance and delete the rest
            for duplicate in company_list[1:]:
                company_id = duplicate['company_id']
                if delete_company(company_id):
                    print(f"Successfully deleted duplicate company ID: {company_id}")
                else:
                    print(f"Failed to delete duplicate company ID: {company_id}")
        else:
            print(f"No duplicates found for company: {company_name}")

if __name__ == "__main__":
    remove_duplicates()
