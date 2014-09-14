import os
from flask import Flask
from flask import render_template
from flask.ext.bcrypt import Bcrypt
from pymongo import MongoClient

app = Flask(__name__)
app.config['DEBUG'] = True
app.config['MONGO_DBNAME'] = 'opencourse'
app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'
bcrypt = Bcrypt(app)
app.config['REGUSER'] = 'UPENN_OD_emtz_1000643'
app.config['REGPW'] = 'o448e5mnbutjcji5ufofo630ur'
app.config['pcr_token'] = 'qL_UuCVxRBUmjWbkCdI554grLjRMPY'



server = 'ds033750.mongolab.com'
port = 33750
db_name = 'opencourse'
username = 'feef'
password = 'p3nn4pps'
##connect to database
conn = MongoClient(server, port)
mongo = conn[db_name]
mongo.authenticate(username, password)


import openn.users
import openn.db
import openn.graphdata
