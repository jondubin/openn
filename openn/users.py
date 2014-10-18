from openn import app, mongo, bcrypt
# import app, mongo
import json
from bson import json_util
from flask import session, render_template, request, jsonify
from datetime import timedelta
from bson.json_util import dumps
import time


@app.route("/")
def hello():
    if 'username' not in session: 
        return render_template('index.html')
    user = mongo.students.find_one({'username': session['username']})
    if user == None:
        return render_template('index.html')
    if 'grades' not in user:
        return render_template('landing.html', numUsers = mongo.students.count())
    else: return render_template('main.html')



#function to log them in, assumes using a form
##if they cannot log in, will redirect them 
@app.route("/authenticate")
def auth():
    import pdb

    entered_user = request.args['user']
    entered_password = request.args['password']

    # # Check for some errors
    if len(entered_user) == 0:
        return jsonify(errors = 'username_none')
    if len(entered_password) == 0:
        return jsonify(errors = 'pass_none')

    students = mongo.students
    # Find the user
    user = students.find_one({'username': entered_user.lower()})
    if not user == None:
        # The user was found, so continue
        # if u['password'] == bcrypt.hashpw(entered_password, u['password']):
        # pw_hash = bcrypt.generate_password_hash(entered_password, 12)
        if bcrypt.check_password_hash(user['password'], entered_password):
            # Assign session data for user
            session['username'] = user['username']
            app.logger.error('here')
            return jsonify(username=user['username'])
        else:
            return jsonify(errors='signin_mismatch')
    else:
        # The user was not found
        return jsonify(errors='signin_mismatch')

#enters a user into the database
@app.route("/create", methods=['GET'])
def create():
    username = request.args['user'].strip()
    pw1 = request.args['password']

    # Catch some errors
    if len(username) == 0:
        return jsonify(errors='username_none')

    # Make sure this isn't a duplicate username -- THIS DOES NOT YET WORK *cough* PyMongo *cough*
    name_exists = mongo.students.find_one({'username': username.lower()})
    if name_exists:
        # The desired username is taken
        return jsonify(errors='username_taken')

    if len(pw1) == 0:
        return jsonify(errors='pass_none')

    #Let's put the post in the MongoDB database
    # Hash a password for the first time, with a randomly-generated salt
    # hashed_password = bcrypt.hashpw(pw1, bcrypt.gensalt(12))
    hashed_password = bcrypt.generate_password_hash(pw1, 12)
    user_id = mongo.students.insert({
        'username': username.lower(),
        'password': hashed_password
    })
    app.permanent_session_lifetime = timedelta(days=365)
    # Assign session data for user
    session.permanent = True
    session['id'] = dumps(user_id)
    session['username'] = username
    user = mongo.students.find_one({'username': session['username']})
    return jsonify(user=username)



@app.route("/logout/", methods=['GET'])
def logout():
    session.pop('username', None)
    return jsonify(errors='none')
