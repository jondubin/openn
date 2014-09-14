from openn import app, mongo
from flask import request, jsonify, session
import json, yaml

# @app.route('/getGraphData', methods=['GET'])
# def getGraphData():
#     

@app.route('/personalPerformance', methods=['GET'])
def getPersonal():
    username = session['username']
    user = mongo.students.find_one({'username': username})
    return jsonify(data = user['grades'])
