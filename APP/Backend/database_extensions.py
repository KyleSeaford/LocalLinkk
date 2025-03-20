import logging
import uuid
import os
from dotenv import load_dotenv
import psycopg2
from psycopg2 import sql
from datetime import datetime
from datetime import date

load_dotenv()
logging.basicConfig(level=os.getenv("logLevel"), format=str(os.getenv("logFormat")), filename=os.getenv("logFilename")) 

class database_extensions():
    def __init__(self):
        self.databaseFileName = str(os.getenv("dbDatabase"))

    def fetchAll(self, sql):
        """Fetch all of the records from the database"""
        logging.debug(f"fetchAll from postgres sql {sql}")

        conn = psycopg2.connect(
            host=os.getenv("dbHost"),
            database=os.getenv("dbDatabase"),
            user=os.getenv("dbUser"),
            password=os.getenv("dbPassword")
        )
        cursor = conn.cursor()
        cursor.execute(sql)
        records = cursor.fetchall()  
        conn.close() 
        return records  

    def fetchSingleRecord(self, sql):
        """Fetch one record from the database"""
        logging.debug(f"fetchSingleRecord from postgres sql {sql}")

        conn = psycopg2.connect(
            host=os.getenv("dbHost"),
            database=os.getenv("dbDatabase"),
            user=os.getenv("dbUser"),
            password=os.getenv("dbPassword")
        )
        cursor = conn.cursor()
        cursor.execute(sql)
        record = cursor.fetchone()  
        conn.close() 
        return record

    def fetchSingleValue(self, sql):
        """Fetch one single value from the database"""
        records = self.fetchAll(sql)  

        if not records and len(records) == 0: 
            raise Exception("No record found")
                
        if len(records) > 1: 
            raise Exception("More than one record found")

        return records[0][0]   

    def fetchJson(self, fields, table, where, order):
        """Fetch all of the records from the database and return result in a JSON list"""
        sql = "select " + ','.join(fields) + f" from {table} {where} {order}"
        result = []
        for record in self.fetchAll(sql):
            resultRow = {}
            for i in range(len(fields)):  
                v = record[i]
                if isinstance(v, date):
                    v = str(v)
                resultRow[fields[i]] = v           
            result.append(resultRow)
        return result

    def execute(self, sql):
        """Execute an sql command that will not return any records"""
        logging.debug(f"execute from postgres sql {sql}")

        conn = psycopg2.connect(
            host=os.getenv("dbHost"),
            database=os.getenv("dbDatabase"),
            user=os.getenv("dbUser"),
            password=os.getenv("dbPassword")
        )
        cursor = conn.cursor()
        cursor.execute(sql)
        conn.commit()
        conn.close()
    
    def generateId(self):
        """Generate a unique id number"""
        id = str(uuid.uuid4())
        logging.debug(f"generate id {id}")
        return id
    
    def close(self):
        """Close the database connection"""
        logging.debug(f"close postgres")
        conn = psycopg2.connect(
            host=os.getenv("dbHost"),
            database=os.getenv("dbDatabase"),
            user=os.getenv("dbUser"),
            password=os.getenv("dbPassword")
        )
        conn.close()


    def create_database_and_tables(self, sql_file_path):
        # Create a connection to the server
        conn = psycopg2.connect(
                host=os.getenv("dbHost"),
                database=os.getenv("dbDatabase"),
                user=os.getenv("dbUser"),
                password=os.getenv("dbPassword")
            )
        conn.autocommit = True
        cursor = conn.cursor()

        # Generate a new database name with the current datetime stamp
        new_db_name = "unittest_" + datetime.now().strftime("%Y%m%d_%H%M%S")

        # Create the new database
        cursor.execute(sql.SQL("CREATE DATABASE {}").format(sql.Identifier(new_db_name)))
        print(f"Database {new_db_name} created successfully.")

        # Close the connection to the default database
        cursor.close()
        conn.close()

        # Connect to the newly created database
        conn = psycopg2.connect(
                host=os.getenv("dbHost"),
                database=new_db_name,
                user=os.getenv("dbUser"),
                password=os.getenv("dbPassword")
            )
        conn.autocommit = True
        cursor = conn.cursor()

        # Read the SQL commands from the file
        with open(sql_file_path, 'r') as sql_file:
            sql_commands = sql_file.read()

        # Execute the SQL commands
        cursor.execute(sql_commands)
        print("Tables created successfully.")

        # Close the connection to the new database
        cursor.close()
        conn.close()

        return new_db_name

    def makeSafe(self, input):
        output = input.replace("'", "%27")
        output = output.replace('"', "%22")
        return output