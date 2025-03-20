import csv
import requests

def AddLocationsFromCsv(csv_file_path, region):
    print(f"Reading data from {csv_file_path}")

    # Define the URL for the POST request
    url = 'http://192.168.127.223/Locations/location'

    # Open and read the CSV file
    with open(csv_file_path, mode='r') as file:
        csv_reader = csv.reader(file)
        
        for row in csv_reader:
            try:
                city_name = row[0]
                population = int(row[1])
                
                if (len(row) > 2):
                    continue

                print(f"Posting City {city_name}")

                # Define the payload with the required parameters
                payload = {
                    'name': city_name,
                    'country': 'UK',
                    'region': region,
                    'ismajor': False,
                    'population': population,
                    'latitude': 0,  # Assuming latitude is not provided
                    'longitude': 0  # Assuming longitude is not provided
                }
                
                # Make the POST request
                response = requests.post(url, params=payload)
                
                # Check the response
                if response.status_code == 201:
                    print(f'Successfully added {city_name} with population {population}')
                else:
                    print(f'Failed to add {city_name} with population {population}, Status Code: {response.status_code}, Response: {response.text}')
            except:
                print("Failed to add row", row)

# Program assumes the csv file will have two columns: city name, population
# eg
# Roughton,618
# Roxton,356
# Roxwell,412

csv_file_path = 'C:\\Code\\LocalLinkk\\Robots\\RobotPopulateLocations\\data\\North West.csv'  
region = "North West"
AddLocationsFromCsv(csv_file_path, region)          
print("===finished===")