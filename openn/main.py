#!/usr/bin/env python

# PCR_AUTH_TOKEN = 'qL_UuCVxRBUmjWbkCdI554grLjRMPY'
# username = 'UPENN_OD_emtz_1000643'
# password = 'o448e5mnbutjcji5ufofo630ur'
import os
from flask import Flask
from flask import render_template
# from flask_pymongo import PyMongo
from pymongo import MongoClient

app = Flask(__name__)
app.config['DEBUG'] = True
app.config['MONGO_DBNAME'] = 'togethrdb'

server = 'ds033750.mongolab.com'
port = 33750
db_name = 'opencourse'
username = 'feef'
password = 'p3nn4pps'

conn = MongoClient(server, port)
db = conn[db_name]
db.authenticate(username, password)
posts = db.posts
print '\nNumber of posts', posts.find().count()

@app.route('/')
def landing():
    return render_template('index.html')


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
