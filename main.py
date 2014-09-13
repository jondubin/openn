#!/usr/bin/env python

# PCR_AUTH_TOKEN = 'qL_UuCVxRBUmjWbkCdI554grLjRMPY'
# username = 'UPENN_OD_emtz_1000643'
# password = 'o448e5mnbutjcji5ufofo630ur'
import os
from flask import Flask
from flask import render_template
# from flask_pymongo import PyMongo


app = Flask(__name__)
app.config['DEBUG'] = True


@app.route('/')
def landing():
    return render_template('index.html')


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, port=33507)