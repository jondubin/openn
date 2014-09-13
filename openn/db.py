from openn import app, mongo
from flask import request
import json

@app.route("/insertDatabase", methods = ['GET'])
def req(): 
    # import pdb
    username = request.args['username']
    year     = request.args['year']
    grades   = json.loads(request.args['grades'])
    school   = request.args['division']
    

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

        ## course doesn't exist yet
        if courseObj == None:
            mongo.classes.insert(
                {course: {
                    section: {'className': info[1], 
                             'grades': [info[0]], 
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


    return 'success'
    
