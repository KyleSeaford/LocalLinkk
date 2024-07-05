# Robot Populate Locations

The robot is responsible for populating the locations table with city names.

The city names and population information came from https://www.nomisweb.co.uk/query/construct/components/stdListComponent.asp?menuopt=12&subcomp=100

Cities with the flag isMajor = true came from "major towns and cities Info"
All other cities came from "built-up areas including subdivisions"

- East

- East Midlands
- London
- North East
- North West
- South East
- South West
- Wales
- West Midlands
- Yorkshire


## Execution

- In the python script, ddit the address of the csv file that is stored in the variable csv_file_path
- Edit the hard coded values in the payload like country and region
- Run python script `python robot_populate_locations.py'