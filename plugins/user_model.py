from plugin import Plugin

from database import TableBase, Column, Text
from database import engine, session
from flask_login import current_user, login_required, login_user, logout_user
from models import User


class user_model(Plugin):
    def __init__(self):
        super().__init__()
        print('user_model plugin loaded')
        self.name = 'user_model'

    def process(self, request):
        if request['action'] == 'validate_login':
            print('Login: ', request['email'], request['password'])
            email = request['email']
            password = request['password']
            user = User.get_user_by_email(email)
            if not user:
                return {'success': False, 'error': 'Email not found'}
            elif not user.check_password(password):
                return {'success': False, 'error': 'Email or password incorrect'}
            else:
                login_user(user, remember='remember' in request)
                return {'success': True}
        elif request['action'] == 'create_user':
            print('Create: ', request['email'], request['password'], request['username'])
            email = request['email']
            password = request['password']
            username = request['username']
            if User.get_user_by_email(email):
                return {'success': False, 'error': 'Email already exists'}
            user = User(email, password, username)
            session.add(user)
            session.commit()
            return {'success': True}
        elif request['action'] == 'logout':
            print('Logout')
            logout_user()
            return {'success': True}
        elif request['action'] == 'get_user_data':
            if not current_user.is_authenticated:
                return {'success': False, 'error': 'Not logged in'}
            else:
                d = {'success': True}
                d['id'] = current_user.id
                d['email'] = current_user.email
                d['username'] = current_user.username
                d['avatar'] = current_user.avatar
                d['description'] = current_user.description
                d['education'] = current_user.education
                d['major'] = current_user.major
                return d
        elif request['action'] == 'head_change':
            if not current_user.is_authenticated:
                return {'success': False, 'error': 'Not logged in'}
            else:
                current_user.avatar = request['data']
                session.add(current_user)
                session.commit()
                return {'success': True}
        else:
            return {'success': False, 'error': 'Unknown action'}

    def unload(self):
        print('user plugin unloaded')


__plugin__ = user_model()
