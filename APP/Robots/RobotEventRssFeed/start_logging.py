import logging
import os
from dotenv import load_dotenv

load_dotenv()
logging.basicConfig(level=os.getenv("logLevel"), format=str(os.getenv("logFormat")), filename=os.getenv("logFilename")) 

def log(message):
    logging.info(message)
    print(message)

def error(message, ex):
    logging.error(f"ERROR {message}: {ex}")
    print(f"ERROR {message}: {ex}")