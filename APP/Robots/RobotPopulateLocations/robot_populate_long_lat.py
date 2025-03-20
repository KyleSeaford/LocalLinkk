# Now you can import the module
import logging
import os
from dotenv import load_dotenv
from database_extensions import database_extensions
import requests

load_dotenv()
logging.basicConfig(level=os.getenv("logLevel"), format=str(os.getenv("logFormat")), filename=os.getenv("logFilename")) 



for record in  database_extensions().fetchAll("SELECT * FROM locations where longitude = 0 order by population desc LIMIT 1000"):
    print("record = ", record)
    locationId = record[0]
    locationName = record[1]
    print("\tlocation id = ", locationId)
    print("\tlocation name = ", locationName)

    response = requests.get("http://192.168.127.223/Locations/location/" + locationName)
    print("\tResponse Status Code = ", response.status_code)
    print("\tResponse Content = ", response.content)


print("=== Finished ===")