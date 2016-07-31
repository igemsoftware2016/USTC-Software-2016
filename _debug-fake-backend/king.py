from flask import *

app = Flask(__name__)


@app.route('/')
def hello_world():
    return redirect('/static/login-1.html')


@app.route('/validateLogin',methods=["POST"])
def login_enter():
    data = request.json

    # for debug with password(error code test)
# success
    if data['password'] == '1':
        return json.dumps('true')
# account not found
    if data['password'] == 'a1':
        return json.dumps({'error':'a1'})
# wrong password
    if data['password'] == 'a2':
        return json.dumps({'error':'a2'})
    else:
        return 1


@app.route('/signup',methods=["POST"])
def signin_enter():
    data = request.json

    # for debug with password(error code test)
# success
    if data['password'] == '1':
        return json.dumps('true')
# account already registered
    if data['password'] == 'b1':
        return json.dumps({'error': 'b1'})
    else:
        return 1

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, threaded=True)
