@app.route("/")
def display():
    if 'username' in session:
        return render_template('index.html', user=session['username'])
    else:
        return render_template('login.html')