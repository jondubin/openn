import os
from flask import Flask
from flask import render_template
from pymongo import MongoClient

app = Flask(__name__)
app.config['DEBUG'] = True
app.config['MONGO_DBNAME'] = 'opencourse'

server = 'ds033750.mongolab.com'
port = 33750
db_name = 'opencourse'
username = 'feef'
password = 'p3nn4pps'
##connect to database
conn = MongoClient(server, port)
db = conn[db_name]
db.authenticate(username, password)
