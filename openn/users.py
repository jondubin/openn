import app
from flask import sesssion, render_template

@app.route("/logout/", methods = ['POST'])
def logout():
    session.pop('username', None)
    return render_template('index.html')