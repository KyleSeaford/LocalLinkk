from flask_restx import Api, Namespace, Resource, reqparse, fields
from flask import Flask, send_file
from database_extensions import database_extensions
import logging
import os
import hashlib
from dotenv import load_dotenv
import sqlite3
from flask_cors import CORS
from flask_jwt_extended import JWTManager, get_jwt, jwt_required, create_access_token
from flask import request, make_response
import os
import shutil
from werkzeug.datastructures import FileStorage
import base64

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

CORS(app)  # Allow CORS for all routes

api = Api(app, authorizations=authorizations, security='Token')

api = Namespace('Users', description='Users Endpoint')

db = database_extensions()

userID = 'userID'
userID2 = 'userID'
userFname = 'userFname'
userLname = 'userLname'
userLocation = 'userLocation'
userEmail = 'userEmail'
userPassword = 'userPassword'
userType = 'userType'

@api.route("/users",  doc={"description": "Gets all users"})
class Users(Resource):
    def get(self):
        logging.debug(f"Getting all users")
        return db.fetchJson([userID, userFname, userLname, userLocation, userEmail, userPassword, userType], 'users', '', f'ORDER BY {userID} ASC')

@api.route("/users/<string:id>",  doc={"description": "Gets a user by ID"})
class Users(Resource):
    parserGet = reqparse.RequestParser()
    parserGet.add_argument(userID2, type=str, help='User ID', required=True)
    
    def get(self, id):
        logging.debug(f"Getting user by ID")
        user = db.fetchSingleRecord(f"SELECT {userID}, {userFname}, {userLname}, {userLocation}, {userEmail}, {userType} FROM users WHERE {userID2} = '{id}'")
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

        shutil.rmtree(f"profilePictures/{id}", ignore_errors=True)
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
        userid = newUserID
        sql = f"INSERT INTO users ({userID}, {userFname}, {userLname}, {userLocation}, {userEmail}, {userPassword}) VALUES ('{userid}', '{data[userFname]}', '{data[userLname]}', '{data[userLocation]}', '{data[userEmail]}', '{hashlib.md5(data[userPassword].encode()).hexdigest()}')"
        
        try:
            db.execute(sql)
            os.mkdir(f"profilePictures/{userid}")
            shutil.copyfile("zprofilePicture.jpg", f"profilePictures/{userid}/profilePicture.jpg")
            access_token = create_access_token(identity=userid)
            logging.debug(f"User added - access_token: {access_token}")
            return {'access_token': access_token, 'userID': userid}, 201
        
        except sqlite3.IntegrityError:
            logging.error(f"Email {data[userEmail]} already exists")
            db.close()
            return {'message': 'Email already exists'}, 400

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
            return {'access_token': access_token, 'userID': user[0]}, 200

        else:
            logging.debug(f"Incorrect password")
            return {'message': 'Incorrect password'}, 401


@api.route("/users/locations", doc={"description": "gets all the locations of the users"})
class Users(Resource):
    def get(self):
        logging.debug(f"Getting all locations")
        return db.fetchJson([userLocation], 'users', '', f'ORDER BY {userLocation} ASC')
    
@api.route("/users/locations/<string:id>", doc={"description": "gets a location of a user by ID"})
class Users(Resource):
    parserGet = reqparse.RequestParser()
    parserGet.add_argument(userID2, type=str, help='User ID', required=True)
    
    def get(self, id):
        logging.debug(f"Getting location by ID")
        location = db.fetchSingleRecord(f"SELECT {userLocation} FROM users WHERE {userID2} = '{id}'")

        location = location[0]
        logging.debug(f"location: {location}")


        if location is None:
            logging.debug(f"Location not found")
            return {'message': 'Location not found'}, 404
        
        return {'message': location}, 200
    
@api.route("/users/locations/change/<string:id>/<string:location>", doc={"description": "Changes the location of a user by ID"})
class Users(Resource):
    parserChange = reqparse.RequestParser()
    parserChange.add_argument(userID2, type=str, help='User ID', required=True)
    parserChange.add_argument(userLocation, type=str, help='Location', required=True)

    def put(self, id, location):
        logging.debug(f"Changing location by ID")
        db.execute(f"UPDATE users SET {userLocation} = '{location}' WHERE {userID} = '{id}'")
        logging.debug(f"Location changed")
        return {'message': 'Location changed'}, 200

@api.route("/users/nameChange", doc={"description": "Changes the name of a user by ID"})
class Users(Resource):
    parserChange = reqparse.RequestParser()
    parserChange.add_argument(userID2, type=str, help='User ID', required=True)
    parserChange.add_argument(userFname, type=str, help='First Name', required=True)
    parserChange.add_argument(userLname, type=str, help='Last Name', required=True)

    @api.doc(parser=parserChange)
    def put(self):
        logging.debug(f"Changing name by ID")
        data = self.parserChange.parse_args()
        db.execute(f"UPDATE users SET {userFname} = '{data[userFname]}', {userLname} = '{data[userLname]}' WHERE {userID} = '{data[userID2]}'")
        logging.debug(f"Name changed")
        return {'message': 'Name changed'}, 200
    
@api.route("/users/passwordChange", doc={"description": "Changes the password of a user by ID"})
class Users(Resource):
    parserChange = reqparse.RequestParser()
    parserChange.add_argument(userID2, type=str, help='User ID', required=True)
    parserChange.add_argument(userPassword, type=str, help='Password', required=True)

    @api.doc(parser=parserChange)
    def put(self):
        logging.debug(f"Changing password by ID")
        data = self.parserChange.parse_args()
        db.execute(f"UPDATE users SET {userPassword} = '{hashlib.md5(data[userPassword].encode()).hexdigest()}' WHERE {userID} = '{data[userID2]}'")
        logging.debug(f"Password changed")
        return {'message': 'Password changed'}, 200
    
@api.route("/users/EmailChange", doc={"description": "Changes the email of a user by ID"})
class Users(Resource):
    parserChange = reqparse.RequestParser()
    parserChange.add_argument(userID2, type=str, help='User ID', required=True)
    parserChange.add_argument(userEmail, type=str, help='Email', required=True)

    @api.doc(parser=parserChange)
    def put(self):
        logging.debug(f"Changing email by ID")
        data = self.parserChange.parse_args()
        db.execute(f"UPDATE users SET {userEmail} = '{data[userEmail]}' WHERE {userID} = '{data[userID2]}'")
        logging.debug(f"Email changed")
        return {'message': 'Email changed'}, 200
    
@api.route("/users/image/<string:id>", doc={"description": "Gets the image of a user by ID"})
class Users(Resource):
    def get(self, id):
        logging.debug(f"Getting image by ID")
        try:
            
            image_dir = f"profilePictures/{id}/profilePicture.jpg"
            logging.debug(f"image_dir: {image_dir}")

            return send_file(image_dir, mimetype='image/jpg')
            #return make_response(image_path)

        except FileNotFoundError:
            logging.debug(f"Image not found")
            return {'message': 'Image not found'}, 404
        
image_model = api.model('Image', {
    'image': fields.String(required=True, description='The image in base64 format')
})

@api.route("/users/imageChange/<string:id>", doc={"description": "Changes the image of a user by ID"})
class Users(Resource):
    parserImage = reqparse.RequestParser()
    parserImage.add_argument('image', type=str, required=True, help='Base64 encoded image string')

    @api.expect(image_model)
    def put(self, id):
        logging.debug(f"Changing image by ID {id}")
        image_data = request.json.get('image')


        try:
            # Ensure the image data is properly formatted
            if ',' in image_data:
                header, image_data = image_data.split(',', 1)
            
            # Decode the base64 string
            image_data = base64.b64decode(image_data)
            
            # Create directory if it doesn't exist
            image_dir = f"profilePictures/{id}"
            if not os.path.exists(image_dir):
                os.makedirs(image_dir)
                
            # Save the image
            image_path = os.path.join(image_dir, 'profilePicture.jpg')
            with open(image_path, 'wb') as image_file:
                image_file.write(image_data)
                
            logging.debug(f"Image changed and saved to {image_path}")
            return {'message': 'Image changed'}, 200
            
        except Exception as e:
            logging.error(f"Error changing image: {e}")
            return {'message': 'Failed to change image', 'error': str(e)}, 500
        
@api.route("/users/TypeChange", doc={"description": "Changes a users type by id"})
class Users(Resource):
    parserChange = reqparse.RequestParser()
    parserChange.add_argument(userID2, type=str, help='User ID', required=True)
    parserChange.add_argument(userType, type=str, help='User Type', required=True)

    @api.doc(parser=parserChange)
    def put(self):
        logging.debug(f"Changing type by ID")
        data = self.parserChange.parse_args()
        db.execute(f"UPDATE users SET {userType} = '{data[userType]}' WHERE {userID} = '{data[userID2]}'")
        logging.debug(f"Type changed")
        return {'message': 'Type changed'}, 200

        
@api.route("/users/admins", doc={"description": "gets all the admins"})
class Users(Resource):
    def get(self):
        logging.debug(f"Getting all admins")
        return db.fetchJson([userID, userFname, userLname, userType], 'users', 'WHERE usertype = "admin"', f'ORDER BY {userID} ASC')
    
