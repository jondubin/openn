from openn import app, mongo
from flask import request, jsonify, session
import json, yaml

@app.route('/personalPerformance', methods=['GET'])
def getPersonal():
    username = session['username']
    user = mongo.students.find_one({'username': username})
    return jsonify(data = user['grades'])

def genGrades(grades):
    ret = []
    numAp = 0
    numA = 0
    numAm = 0
    numBp = 0
    numB = 0
    numBm = 0
    numCp = 0
    numC = 0
    numCm = 0
    numDp = 0
    numD = 0
    numDm = 0
    for i in grades: 
        if i   == 'A+': numAp+=1
        elif i == 'A': numA+=1
        elif i == 'A-': numAm+=1
        elif i == 'B+': numBp+=1
        elif i == 'B': numB+=1
        elif i == 'B-': numBm+=1
        elif i == 'C+': numCp+=1
        elif i == 'C': numC+=1
        elif i == 'C-': numCm+=1
        elif i == 'D+': numDp+=1
        elif i == 'D': numD+=1
        elif i == 'D-': numDm+=1    
    return [numAp, numA, numAm, numBp, numB, numBm, numCp, numC, numCm, numDp, numD, numDm]

## @param course CIS-160
@app.route('/getCourse', methods=['GET'])
def getCourse():
    grades = []
    arg = request.args['course']
    course = mongo.classes.find_one({arg: {'$exists': True}})
    for section, info in course[arg].iteritems():
        grades = grades + info['grades']
    return jsonify(grades = genGrades(grades) )

## @param course CIS-160-001-2014A
@app.route('/getSection', methods=['GET'])
def getSection():
    grades = []
    arg = request.args['section']
    course = '-'.join(arg.split('-')[0:2])
    courseObj = mongo.classes.find_one({course: {'$exists': True}})
    section = courseObj[course][arg]

    return jsonify(grades = genGrades(section['grades']))

    return courseName

# @app.route('/getProf', methods=['GET'])
# def getProf():
    