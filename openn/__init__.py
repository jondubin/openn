import os
from flask import Flask
from flask import render_template
from flask.ext.bcrypt import Bcrypt
from pymongo import MongoClient


app = Flask(__name__)
app.config['DEBUG'] = True
bcrypt = Bcrypt(app)

import openn.secret



server = 'ds033750.mongolab.com'
port = 33750
db_name = 'opencourse'
# username = 'feef'
# password = 'p3nn4pps'
##connect to database
conn = MongoClient(server, port)
mongo = conn[db_name]
mongo.authenticate(app.config['db_username'], app.config['db_password'])


import openn.users
import openn.db
import openn.graphdata
