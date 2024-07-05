from flask_restx import Api, Namespace, Resource, reqparse
from flask import Flask
from database_extensions import database_extensions
import logging
import os
from dotenv import load_dotenv

load_dotenv()
logging.basicConfig(level=os.getenv("logLevel"), format=str(os.getenv("logFormat")), filename=os.getenv("logFilename")) 

app = Flask(__name__)
api = Api(app)
api = Namespace('Locations', description='Locations Endpoint')
db = database_extensions(os.getenv("databaseFilename"))
databaseTableName = 'locations'
databaseFieldLocationId = 'id'
databaseFieldLocationName = 'name'
databaseFieldRegion = 'region'
databaseFieldCountry = 'country'
databaseFieldIsMajor = 'ismajor'
databaseFieldPopulation = 'population'
databaseFieldLatitude = 'latitude'
databaseFieldLongitude = 'longitude'

class Locations():    
    def __init__(self, databaseName):
        global db
        db = database_extensions(databaseName)

parser = reqparse.RequestParser()
parser.add_argument(databaseFieldCountry, type=str, required=False, help='Country name')
parser.add_argument(databaseFieldRegion, type=str, required=False, help='Region name')
parser.add_argument(databaseFieldIsMajor, type=bool, required=False, help='Is major city')
parser.add_argument(databaseFieldPopulation, type=int, required=False, help='Minimum population')
@api.route('/locations', doc={"description": "Get locations with optional filters"})
class GetFilteredLocations(Resource):
    @api.expect(parser)
    def get(self):
        args = parser.parse_args()
        country = args.get('country')
        region = args.get('region')
        is_major = args.get('isMajor')
        population = args.get('population')

        conditions = []
        if country:
            conditions.append(f"{databaseFieldCountry}='{country}'")
        if region:
            conditions.append(f"{databaseFieldRegion}='{region}'")
        if is_major is not None:
            conditions.append(f"{databaseFieldIsMajor}={is_major}")
        if population:
            conditions.append(f"{databaseFieldPopulation}>={population}")

        where_clause = " AND ".join(conditions)
        if where_clause:
            where_clause = "WHERE " + where_clause

        return db.fetchJson(
            [databaseFieldLocationId, databaseFieldLocationName, databaseFieldRegion, databaseFieldCountry, databaseFieldIsMajor, databaseFieldPopulation, databaseFieldLatitude, databaseFieldLongitude],
            databaseTableName,
            where_clause,
            f'ORDER BY {databaseFieldLocationName} ASC'
        )


@api.route('/location', doc={"description": "Add a new location"})
class PostLocation(Resource):
    parserPost = reqparse.RequestParser()
    parserPost.add_argument(databaseFieldLocationName, type=str, required=False, help='Country name')
    parserPost.add_argument(databaseFieldCountry, type=str, required=False, help='Country name')
    parserPost.add_argument(databaseFieldRegion, type=str, required=False, help='Region name')
    parserPost.add_argument(databaseFieldIsMajor, type=bool, required=False, help='Is major city')
    parserPost.add_argument(databaseFieldPopulation, type=int, required=False, help='Population')
    parserPost.add_argument(databaseFieldLatitude, type=int, required=False, help='Latitude')
    parserPost.add_argument(databaseFieldLongitude, type=int, required=False, help='Longitude')

    @api.doc(parser=parserPost)
    def post(self):
        args = self.parserPost.parse_args()
        name = args[databaseFieldLocationName]
        country = args[databaseFieldCountry]

        # Check if the location already exists
        recordExists = db.fetchSingleValue(f"SELECT COUNT(*) FROM {databaseTableName} WHERE {databaseFieldLocationName}='{name}' and {databaseFieldCountry}='{country}'")
        if recordExists > 0:
            return {'message': f'Location {name} already exists'}, 400
        
        id = db.generateId()

        db.execute(f"INSERT INTO {databaseTableName} ({databaseFieldLocationId}, {databaseFieldLocationName}, {databaseFieldRegion}, {databaseFieldCountry}, {databaseFieldIsMajor}, {databaseFieldPopulation}, {databaseFieldLatitude}, {databaseFieldLongitude}) VALUES ('{id}', '{name}', '{args[databaseFieldRegion]}', '{args[databaseFieldCountry]}','{args[databaseFieldIsMajor]}','{args[databaseFieldPopulation]}','{args[databaseFieldLatitude]}','{args[databaseFieldLongitude]}')") 
        return {'message': 'Location added successfully', 'id':id}, 201