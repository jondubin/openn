from openn import app, mongo
from flask import sesssion, render_template

import bcrypt, time

@app.route("/hi")
def display():
    return "hello world"

#function to log them in, assumes using a form
##if they cannot log in, will redirect them 
@app.route("/login/", methods = ['GET, POST'])
def auth():
    entered_user = request.form['user']
    entered_password = request.form['password']

    # Check for some errors
    if len(entered_user) == 0:
        return jsonify(errors = 'username_none')
    if len(entered_password) == 0:
        return jsonify(errors = 'pass_none')

    # Find the user
    u = mongo.db.users.find_one({'name_lower': entered_user.lower()})
    if not(u == None):
        # The user was found, so continue
        if u['password'] == bcrypt.hashpw(entered_password, u['password']):
            # Assign session data for user
            session['username'] = u['name']
            session['username_lower'] = u['name_lower']

            return jsonify(user = u['name'])
        else:
            return jsonify(errors = 'signin_mismatch')
    else:
        # The user was not found
        return jsonify(errors = 'signin_mismatch')


@app.route("/logout/", methods = ['POST'])
def logout():
    session.pop('username', None)
    return render_template('index.html')
