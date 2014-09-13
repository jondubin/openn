from openn import app, mongo
# import app, mongo
import json
from bson import json_util
from flask import session, render_template, request, jsonify
from datetime import timedelta
from bson.json_util import dumps
import bcrypt, time



@app.route("/")
def hello():
    return render_template('index.html')

@app.route("/hi")
def display():
    return "hello world"

#function to log them in, assumes using a form
##if they cannot log in, will redirect them 
@app.route("/authenticate")
def auth():
    entered_user = request.args['user']
    entered_password = request.args['password']

    # # Check for some errors
    if len(entered_user) == 0:
        return jsonify(errors = 'username_none')
    if len(entered_password) == 0:
        return jsonify(errors = 'pass_none')

    students = mongo.students
    # Find the user
    u = students.find_one({'username': entered_user.lower()})
    if not(u == None):
        # The user was found, so continue
        if u['password'] == bcrypt.hashpw(entered_password, u['password']):
            # Assign session data for user
            session['username'] = u['username']
            return jsonify(user = u['username'])
        else:
            return jsonify(errors = 'signin_mismatch')
    else:
        # The user was not found
        return jsonify(errors = 'signin_mismatch')

#enters a user into the database
@app.route("/create", methods = ['GET'])
def create():
    username = request.args['user'].strip()
    pw1 = request.args['password']

    # Catch some errors
    if len(username) == 0:
        return jsonify(errors = 'username_none')

    # Make sure this isn't a duplicate username -- THIS DOES NOT YET WORK *cough* PyMongo *cough*
    name_exists = mongo.students.find_one({'username': username.lower()})
    if not(name_exists == None):
        # The desired username is taken
        return jsonify(errors = 'username_taken')

    if len(pw1) == 0:
        return jsonify(errors = 'pass_none')

    #Let's put the post in the MongoDB database
    if pw1:
        # Hash a password for the first time, with a randomly-generated salt
        hashed_password = bcrypt.hashpw(pw1, bcrypt.gensalt(12))
        user_id = mongo.students.insert({'username' : username.lower(),
                                'password': hashed_password
                                })
        app.permanent_session_lifetime = timedelta(days=365)
        # Assign session data for user
        session.permanent = True
        session['id'] = dumps(user_id)
        session['username'] = username

        return jsonify(user = username)
    else:
        # Passwords did not match
        return jsonify(errors = 'pass_nomatch')

@app.route("/logout/", methods = ['GET'])
def logout():
    session.pop('username', None)
    return render_template('index.html')
