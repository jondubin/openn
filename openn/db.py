from openn import app, mongo
from flask import request, jsonify
from penn import registrar
import penncoursereview
import json, yaml
import pdb
import requests


reg_user = app.config['REGUSER']
reg_pw = app.config['REGPW']
baseURL = "http://api.penncoursereview.com/v1/"
PCR_AUTH_TOKEN = app.config['pcr_token']

@app.route("/insertDatabase", methods = ['GET'])
def req(): 
    username = request.args['username']
    year     = request.args['year']
    grades   = json.loads(request.args['grades'])
    school   = request.args['division']
    
    reg = registrar.Registrar(reg_user, reg_pw)

    # app.logger.error(type(grades))
    if (mongo.students.find_one({'username': username})): 
        student = mongo.students.update({'username': username}, 
            {"$set": {'grades': grades, 
                      'school': school, 
                      'year': year}})
    else: #technically shouldn't hit this point
        student = mongo.students.insert({
            'username': username, 
            'grades': grades, 
            'school': school, 
            'year': year
            })

    for section, info in grades.iteritems():
        course = '-'.join(section.split('-')[0:2])
        courseObj = mongo.classes.find_one({course: {'$exists': True}})
        prof_id = getProf(course, section) 
        ## course doesn't exist yet
        if courseObj == None:
            mongo.classes.insert(
                {course: {
                    section: {'className': info[1], 
                             'grades': [info[0]], 
                             'prof': prof_id, 
                             'students': [username]}
                    }
                })
        #course exists but section does not
        elif section not in courseObj[course]:
            mongo.classes.update(
                {course: {'$exists': True}}, 
                {'$set': {course + '.' + section: {
                'className': info[1], 
                'grades': [info[0]], 
                'prof': prof_id,
                'students': [username]}
                }})      
            # mongo.classes.update({course: {'$exists': True}})
        else: 
            # pdb.set_trace()
            sec = course + '.' + section
            if username not in courseObj[course][section]['students']:
                mongo.classes.update(
                 {course: {'$exists': True}}, 
                 {'$push': {sec + '.grades': info[0]} } )
                mongo.classes.update(
                 {course: {'$exists': True}}, 
                 {'$push': {sec + '.students': username} } )


    return jsonify(success='success')
    


def getProf(course, section):
    # pdb.set_trace()
    semester = section.split('-')[3]
    subsection = section.split('-')[2]
    try:
        history = penncoursereview.CourseHistory(course)
    except: 
        return
    for section in history['courses']:
        if section['semester'] == semester:
            req = requests.get(baseURL + section['path'] + "?token="+ PCR_AUTH_TOKEN)
            data = yaml.load(req.text)
            for s in data['result']['sections']['values']:
                if s['sectionnum'] == subsection:

                    req2 = requests.get(baseURL + s['path'] + "?token="+ PCR_AUTH_TOKEN)
                    data2 = yaml.load(req2.text)
                    prof_id = data2['result']['instructors'][0]['id']
                    return prof_id
            break

    return "none"

