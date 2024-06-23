#!/usr/bin/python
import sys
import logging

import os
from os.path import join, dirname
from dotenv import load_dotenv

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

# create logger
logger = logging.getLogger('simple_example')
logging.basicConfig(level=os.getenv("logLevel"), format=str(os.getenv("logFormat")), filename=os.getenv("logFilename"))

# create console handler and set level to debug
ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)

# create formatter
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

# add formatter to ch
ch.setFormatter(formatter)

# add ch to logger
logger.addHandler(ch)

# 'application' code
logger.debug('debug message4')
logger.info('info message4')
logger.warning('warn message4')
logger.error('error message4')
logger.info("***dotenv_path=" + dotenv_path)
logger.critical('critical message4')

# Set project path
sys.path.insert(0,os.getenv("projectPath"))

# Start Application
logger.info("app.wsgi - starting app from folder " + os.getenv("projectPath") + " with database" + os.getenv("databaseFilename"))
from application import app as application
application.secret_key = 'bob'
