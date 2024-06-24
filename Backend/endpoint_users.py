from flask_restx import Api, Namespace, Resource, reqparse
from flask import Flask
from database_extensions import database_extensions
import logging
import os
import hashlib
from dotenv import load_dotenv
import jwt
from flask_jwt_extended import JWTManager, get_jwt, jwt_required, create_access_token
from flask import request, make_response

load_dotenv()
logging.basicConfig(level=os.getenv("logLevel"), format=str(os.getenv("logFormat")), filename=os.getenv("logFilename")) 

authorizations = {
    'Token': {
        'type': 'apiKey',
        'in': 'header',
        'name': 'Authorization'
    }
}

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY') # make sure to change this in .env file
jwt = JWTManager(app) 

api = Api(app, authorizations=authorizations, security='Token')

api = Namespace('Users', description='Users Endpoint')

db = database_extensions(os.getenv("databaseFilename"))

userID = 'userID'
userID2 = 'userID'
userFname = 'userFname'
userLname = 'userLname'
userLocation = 'userLocation'
userEmail = 'userEmail'
userPassword = 'userPassword'
userType = 'userType'
userAdmin = 'userAdmin' # 1 = admin, 0 = user

class Users():    
    def __init__(self, databaseName):
        global db
        db = database_extensions(databaseName)

@api.route("/users",  doc={"description": "Gets all users"})
class Users(Resource):
    def get(self):
        logging.debug(f"Getting all users")
        return db.fetchJson([userID, userFname, userLname, userLocation, userEmail, userPassword, userType, userAdmin], 'users', '', f'ORDER BY {userID} ASC')

@api.route("/users/<string:id>",  doc={"description": "Gets a user by ID"})
class Users(Resource):
    parserGet = reqparse.RequestParser()
    parserGet.add_argument(userID2, type=str, help='User ID', required=True)
    
    def get(self, id):
        logging.debug(f"Getting user by ID")
        user = db.fetchSingleRecord(f"SELECT {userID}, {userFname}, {userLname}, {userLocation}, {userEmail}, {userPassword}, {userType}, {userAdmin} FROM users WHERE {userID2} = '{id}'")
        logging.debug(f"user: {user}")
        
        if user is None:
            logging.debug(f"User not found")
            return {'message': 'User not found'}, 404
        
        return user, 200
    
@api.route("/users/remove/<string:id>", doc={"description": "Removes a user by ID"})
class Users(Resource):
    parserRM = reqparse.RequestParser()
    parserRM.add_argument(userID2, type=str, help='User ID', required=True)

    def delete(self, id):
        logging.debug(f"Removing a user by ID")
        db.execute(f"DELETE FROM users WHERE {userID} = '{id}'")
        logging.debug(f"User removed")
        return {'message': 'User removed'}, 200


@api.route("/users/signup", doc={"description": "Signs up a user"})
class Users(Resource):
    parserAdd = reqparse.RequestParser()
    parserAdd.add_argument(userFname, type=str, help='First Name', required=True)
    parserAdd.add_argument(userLname, type=str, help='Last Name', required=True)
    parserAdd.add_argument(userLocation, type=str, help='Location', required=True)
    parserAdd.add_argument(userEmail, type=str, help='Email', required=True)
    parserAdd.add_argument(userPassword, type=str, help='Password', required=True)

    @api.doc(parser=parserAdd)
    def post(self):
        logging.debug(f"Adding a new user")
        data = self.parserAdd.parse_args()
        newUserID = db.generateId()
        sql = f"INSERT INTO users ({userID}, {userFname}, {userLname}, {userLocation}, {userEmail}, {userPassword}) VALUES ('{newUserID}', '{data[userFname]}', '{data[userLname]}', '{data[userLocation]}', '{data[userEmail]}', '{hashlib.md5(data[userPassword].encode()).hexdigest()}')"
        db.execute(sql)
        access_token = create_access_token(identity=sql[0])
        logging.debug(f"User added - access_token: {access_token}")
        return {'access_token': access_token}, 201
    

@api.route("/users/login", doc={"description": "Logs in a user"})
class Users(Resource):
    parserLogin = reqparse.RequestParser()
    parserLogin.add_argument(userEmail, type=str, help='Email', required=True)
    parserLogin.add_argument(userPassword, type=str, help='Password', required=True)

    @api.doc(parser=parserLogin)
    def post(self):
        logging.debug(f"Logging in a user")
        data = self.parserLogin.parse_args()
        user = db.fetchSingleRecord(f"SELECT {userID}, {userPassword} FROM users WHERE {userEmail} = '{data[userEmail]}'")
        if user is None:
            logging.debug(f"User not found")
            return {'message': 'User not found'}, 404

        if user[1] == hashlib.md5(data[userPassword].encode()).hexdigest():
            access_token = create_access_token(identity=user[0])
            logging.debug(f"User logged in - access_token: {access_token}")
            return {'access_token': access_token}, 200

        else:
            logging.debug(f"Incorrect password")
            return {'message': 'Incorrect password'}, 401


