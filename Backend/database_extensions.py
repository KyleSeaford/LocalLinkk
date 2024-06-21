import logging
import uuid
import sqlite3

logging.basicConfig(level=logging.DEBUG,  # Set the logging level to DEBUG for all messages
                    format='%(asctime)s - %(levelname)s - %(message)s',
                    filename='database_extensions.log')  # Log messages to a file named 

class database_extensions():
    def __init__(self, db):
        self.databaseFileName = db

    def fetchAll(self, sql):
        """Fetch all of the records from the database"""
        logging.debug(f"fetchAll from {self.databaseFileName} sql {sql}")
        conn = sqlite3.connect(self.databaseFileName)
        cursor = conn.cursor()
        cursor.execute(sql)
        records = cursor.fetchall()  
        conn.close() 
        return records   

    def fetchSingleRecord(self, sql):
        """Fetch one record from the database"""
        logging.debug(f"fetchSingleRecord from {self.databaseFileName} sql {sql}")
        conn = sqlite3.connect(self.databaseFileName)
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
        sql = "select " + ','.join(fields) + f" from `{table}` {where} {order}"
        result = []
        for record in self.fetchAll(sql):
            resultRow = {}
            for i in range(len(fields)):                    
                resultRow[fields[i]] = record[i]           
            result.append(resultRow)
        return result

    def execute(self, sql):
        """Execute an sql command that will not return any records"""
        logging.debug(f"execute from {self.databaseFileName} sql {sql}")
        conn = sqlite3.connect(self.databaseFileName)
        cursor = conn.cursor()
        cursor.execute(sql)
        conn.commit()
        conn.close()
    
    def generateId(self):
        """Generate a unique id number"""
        id = str(uuid.uuid4())
        logging.debug(f"generate id {id}")
        return id