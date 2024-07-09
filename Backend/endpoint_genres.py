import logging
from flask_restx import Api, Namespace, Resource, reqparse
from flask import Flask
from database_extensions import database_extensions
import os
from dotenv import load_dotenv

load_dotenv()
logging.basicConfig(level=os.getenv("logLevel"), format=str(os.getenv("logFormat")), filename=os.getenv("logFilename")) 

app = Flask(__name__)
api = Api(app)
api = Namespace('Genres', description='Genres for types of events endpoint')
db = database_extensions()
databaseTableName = 'genres'
databaseFieldGenreId = 'genre_id'
databaseFieldGenreName = 'genre_name'
databaseFieldParentGenreId = 'parent_genre_id'
argumentGenreName = 'genre Name'
argumentParentGenreId = 'Parent genre Id'

def bread_crumbs(id):
    """ Generate the genres bread crumbs eg "cat1 >> cat2 >> Cat3 >> Cat4" """
    path = []
    if id != 0:
        row = db.fetchSingleRecord(f"SELECT {databaseFieldGenreName}, {databaseFieldParentGenreId} FROM {databaseTableName} WHERE {databaseFieldGenreId}='{id}'")
        if row:            
            name = row[0]
            parent_id = row[1]
            path = bread_crumbs(parent_id) + [name]
    return path

def build_genre_tree(genres, parent_id='0'):
    """Recursively build a tree of genres."""
    tree = []
    for genre in genres:
        if genre['parent_genre_id'] == parent_id:
            children = build_genre_tree(genres, genre['genre_id'])
            genre['children'] = children
            tree.append(genre)
    return tree
    
@api.route('/genres', doc={"description": "Get all genres"})
class Getgenres(Resource):
    def get(self):
        logging.debug("Getgenres - Get all genres")        
        return db.fetchJson([databaseFieldGenreId, databaseFieldGenreName, databaseFieldParentGenreId], databaseTableName, '', f'ORDER BY {databaseFieldGenreName} ASC')

@api.route('/genre/<string:id>/children', doc={"description": "Get children genres"})
@api.param('id', 'genre id')
class GetgenreChildren(Resource):
    def get(self, id):
        return db.fetchJson([databaseFieldGenreId, databaseFieldGenreName, databaseFieldParentGenreId], databaseTableName, f"WHERE {databaseFieldParentGenreId}='{id}'", '')

@api.route('/genre/<string:id>/breadcrumbs', doc={"description": "Get genre bread crumbs"})
@api.param('id', 'genre id')
class GetgenreBreadCrumbs(Resource):
    def get(self, id):
        bread = " >> ".join(bread_crumbs(id))
        return {'bread_crumbs': bread}

@api.route('/genre', doc={"description": "Add a new genre"}) 
class PostGenre(Resource):
    parserAdd = reqparse.RequestParser()
    parserAdd.add_argument(argumentGenreName, type=str, help='genre Name', required=True)
    parserAdd.add_argument(argumentParentGenreId, type=str, help='Parent genre Id', required=True)
    @api.doc(parser=parserAdd)
    def post(self):
        args = self.parserAdd.parse_args()
        genreName = args[argumentGenreName]
        parentGenreId = args[argumentParentGenreId]
        
        # Check if the genre already exists
        recordExists = db.fetchSingleValue(f"SELECT COUNT(*) FROM {databaseTableName} WHERE {databaseFieldGenreName}='{genreName}' and {databaseFieldParentGenreId}='{parentGenreId}'")
        if recordExists > 0:
            return {'message': f'genre {genreName} already exists'}, 400
        
        # Check the parent genre exists
        recordExists = db.fetchSingleValue(f"SELECT COUNT(*) FROM {databaseTableName} WHERE {databaseFieldGenreId}='{parentGenreId}'")
        if recordExists != 1:
            return {'message': f'Parent genre {parentGenreId} does not exists'}, 400

        newGenreId = db.generateId()
        db.execute(f"INSERT INTO {databaseTableName} ({databaseFieldGenreId}, {databaseFieldGenreName}, {databaseFieldParentGenreId}) VALUES ('{newGenreId}', '{genreName}', '{parentGenreId}')") 
        return {'message': 'genre added successfully', 'genre_id':newGenreId}, 201

@api.route('/genre/<genre_id>') 
class UpdateGenre(Resource):
    parserUpdate = reqparse.RequestParser()
    parserUpdate.add_argument(argumentGenreName, type=str, help='genre Name', required=True)
    parserUpdate.add_argument(argumentParentGenreId, type=str, help='Parent genre Id', required=True)
    
    @api.doc(description="Get an existing genre information")
    def get(self, genre_id):
        result = db.fetchJson([databaseFieldGenreId, databaseFieldGenreName, databaseFieldParentGenreId], databaseTableName, f"WHERE {databaseFieldGenreId}='{genre_id}'", '')
        if len(result) == 0:
            return {'message': f'genre {genre_id} does not exists'}, 400
        return result[0]

    @api.doc(parser=parserUpdate)
    @api.doc(description="Update an existing genre")
    def put(self, genre_id):
        args = self.parserUpdate.parse_args()
        genreName = args[argumentGenreName]
        parentGenreId = args[argumentParentGenreId]
        
        # Check if the genre exists
        recordExists = db.fetchSingleValue(f"SELECT COUNT(*) FROM {databaseTableName} WHERE {databaseFieldGenreId}='{genre_id}'")
        if recordExists != 1:
            return {'message': f'genre {genre_id} does not exist'}, 404
        
        # Check the parent genre exists
        recordExists = db.fetchSingleValue(f"SELECT COUNT(*) FROM {databaseTableName} WHERE {databaseFieldGenreId}='{parentGenreId}'")
        if recordExists != 1:
            return {'message': f'Parent genre {parentGenreId} does not exist'}, 400

        db.execute(f"UPDATE {databaseTableName} SET {databaseFieldGenreName}='{genreName}', {databaseFieldParentGenreId}='{parentGenreId}' WHERE {databaseFieldGenreId}='{genre_id}'") 
        return {'message': 'genre updated successfully'}, 200

    @api.doc(description="Delete an existing genre")
    def delete(self, genre_id):
        # Check if the genre exists
        recordExists = db.fetchSingleValue(f"SELECT COUNT(*) FROM {databaseTableName} WHERE {databaseFieldGenreId}='{genre_id}'")
        if recordExists != 1:
            return {'message': f'genre {genre_id} does not exist'}, 404
        
        db.execute(f"DELETE FROM {databaseTableName} WHERE {databaseFieldGenreId}='{genre_id}'") 
        return {'message': 'genre deleted successfully'}, 200

@api.route('/genres/hierarchical', doc={"description": "Get all genres in a hierarchical structure"})
class GetHierarchicalgenres(Resource):
    def get(self):
        genres = db.fetchJson([databaseFieldGenreId, databaseFieldGenreName, databaseFieldParentGenreId], databaseTableName, '', f'ORDER BY {databaseFieldGenreName} ASC')
        hierarchical_genres = build_genre_tree(genres)
        return hierarchical_genres