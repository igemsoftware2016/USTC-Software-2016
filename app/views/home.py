from flask import Blueprint, redirect, url_for, request
from flask_login import current_user, login_required, login_user, logout_user
from models import User
from database import session

home = Blueprint('home', __name__)


@home.route('/')
def index():
    if current_user.is_authenticated:
        return redirect(url_for('static', filename='projects.html'))
    return redirect(url_for('static', filename='login-1.html'))


@home.route('/validateLogin', methods=['POST'])
def login():
    username = request.values['username']
    password = request.values['password']
    return username


@home.route('/login/<int:id>')
def login_test(id):
    login_user(session.query(User).get(id))
    return redirect(url_for('home.index'))


@home.route('/logout')
def logout_test():
    logout_user()
    return redirect(url_for('home.index'))
