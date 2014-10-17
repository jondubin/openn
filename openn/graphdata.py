from openn import app, mongo
from flask import request, jsonify, session
import json, yaml, penncoursereview, requests
import datetime
import profHash
baseURL = "http://api.penncoursereview.com/v1/"
PCR_AUTH_TOKEN = app.config['pcr_token']

import pdb
@app.route('/personalPerformance', methods=['GET'])
def getPersonal():
    username = session['username']
    user = mongo.students.find_one({'username': username})
    grades = [x[0] for x in user['grades'].itervalues()]
    return jsonify(data=user['grades'],
                   graphData=genGrades(grades))

def genGrades(grades):
    ret = []
    numAp = numA = numAm = numBp = numB = numBm = numCp = 0
    numC = numCm = numDp = numD = numDm = 0
    for i in grades: 
        if i == 'A+':
            numAp += 1
        elif i == 'A':
            numA += 1
        elif i == 'A-':
            numAm += 1
        elif i == 'B+':
            numBp += 1
        elif i == 'B':
            numB += 1
        elif i == 'B-':
            numBm += 1
        elif i == 'C+':
            numCp += 1
        elif i == 'C':
            numC += 1
        elif i == 'C-':
            numCm += 1
        elif i == 'D+':
            numDp += 1
        elif i == 'D':
            numD += 1
        elif i == 'D-':
            numDm += 1
    return [numAp, numA, numAm, numBp, numB, numBm, numCp, numC, numCm, numDp, numD, numDm]

## @param course CIS-160
@app.route('/getCourse', methods=['GET'])
def getCourse():
    grades = []
    arg = request.args['course']
    course = mongo.classes.find_one({arg: {'$exists': True}})
    for section, info in course[arg].iteritems():
        grades = grades + info['grades']
    return jsonify(grades=genGrades(grades))

## @param course CIS-160-001-2014A
@app.route('/getSection', methods=['GET'])
def getSection():
    grades = []
    arg = request.args['section']
    course = '-'.join(arg.split('-')[0:2])
    courseObj = mongo.classes.find_one({course: {'$exists': True}})
    section = courseObj[course][arg]

    return jsonify(grades=genGrades(section['grades']))
    # return courseName

def iterateClasses(data):
    grades = []
    for section in data['result']['sections']['values']:
        alias = section['primary_alias']
        # s = requests.get(baseURL + 'Course/' + section['id'] + "?token=public")
        cla = penncoursereview.Course(int(section['id'].split('-')[0]))
        semester = cla['semester']
        course = '-'.join(alias.split('-')[0:2])
        courseObj = mongo.classes.find_one({course: {'$exists': True}})
        section_id = alias + '-' + semester
        if courseObj:
            if section_id in courseObj[course]:
                grades = grades + courseObj[course][alias + '-' + semester]['grades']
    return grades


## @param prof Rajiv Gandhi
## @param dept CIS
@app.route('/getProf', methods=['GET'])
def getProf():
    arg = request.args['prof'].upper()
    # dept = request.args['dept'].upper()
    lastname = arg.split('-')[-1]
    firstname = arg.split('-')[0]
    prof = profHash.profHash[lastname]
    for person in prof: 
        if person["first_name"].split(" ")[0] == firstname:
            prof_id = person['id']
            profClasses = requests.get(baseURL + 'instructors/' + prof_id + "?token=public")
            data = yaml.load(profClasses.text)
            grades = iterateClasses(data)
            return jsonify(grades=genGrades(grades))
            #have list of professor classes
    return jsonify(error="no data yet")

@app.route('/userSchoolData', methods=['GET'])
def getUserSchoolData():
    arr = [0, 0, 0, 0]
    yearArr = [0, 0, 0, 0]
    curYear = datetime.datetime.now().year
    ##this logic will have to be updated!!
    for student in mongo.students.find():
        if 'school' in student: 
            if student['school'] == 'EAS': 
                arr[0] += 1
            elif student['school'] == 'COL':
                arr[1] += 1
            elif student['school'] == 'WHAR': 
                arr[2] += 1
            else:  # nursing
                arr[3] += 1
            if int(student['year'].split(' ')[-1]) - curYear == 1:
                yearArr[0] += 1
            if int(student['year'].split(' ')[-1]) - curYear == 2:
                yearArr[1] += 1
            if int(student['year'].split(' ')[-1]) - curYear == 3:
                yearArr[2] += 1
            if int(student['year'].split(' ')[-1]) - curYear == 4:
                yearArr[3] += 1

    return jsonify(
        schoolData=[['SEAS', arr[0]], ['COLLEGE', arr[1]],
                    ['WHARTON', arr[2]], ['NURSING', arr[3]]],
        yearData=[['Senior', yearArr[0]], ['Junior', yearArr[1]],
                  ['Sophomore', yearArr[2]], ['Freshman', yearArr[3]]])
