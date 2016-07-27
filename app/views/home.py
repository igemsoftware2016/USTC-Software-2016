from flask import Blueprint, redirect, url_for
from flask_login import current_user, login_required, login_user, logout_user
from models import User
from database import DBSession

home = Blueprint('home', __name__)


@home.route('/')
def index():
    if current_user.is_authenticated:
        return 'user_id:{}, user_name:{}'.format(current_user.user_id, current_user.user_name)
    else:
        return 'Hello world!'


@home.route('/login/<int:id>')
def login_test(id):
    session = DBSession()
    login_user(session.query(User).get(id))
    return redirect(url_for('home.index'))


@home.route('/logout')
def logout_test():
    logout_user()
    return redirect(url_for('home.index'))
