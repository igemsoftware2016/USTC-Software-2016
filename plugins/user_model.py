from plugin import Plugin

from database import TableBase, Column, Text
from database import engine, session
from flask_login import current_user, login_required, login_user, logout_user
from models import User
from plugins.pano import __plugin__ as pano


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
            # XXX: Hypercube: give user a pano for a easy begin
            welcome = '''{"nodes":[
                {"id":0,"tax_id":"","gene_id":"","name":"","info":"","title":"How To Use BioHub?","x":200,"y":-700},
                {"id":1,"tax_id":"","gene_id":"","name":"","info":"","title":"Check the detail on left","x":200,"y":-550},
                {"id":2,"tax_id":"","gene_id":"","name":"","info":"","title":"Click PREVIOUS or NEXT","x":200,"y":-400},
                {"id":3,"tax_id":"","gene_id":"","name":"","info":"","title":"Hold SHIFT to link","x":200,"y":-250},
                {"id":4,"tax_id":"","gene_id":"","name":"","info":"","title":"link source","x":350,"y":-250},
                {"id":5,"tax_id":"","gene_id":"","name":"","info":"","title":"link target","x":650,"y":-250},
                {"id":6,"tax_id":"","gene_id":"","name":"","info":"","title":"Try PATH-FINDER!","x":200,"y":-100},
                {"id":7,"tax_id":"562","gene_id":"1238710","name":"tnsA","info":"Tn7 transposase A","title":"path source","x":350,"y":50},
                {"id":8,"tax_id":"562","gene_id":"5961992","name":"bla","info":"beta-lactamase TEM precursor","title":"path target","x":650,"y":50},
                {"id":9,"tax_id":"","gene_id":"","name":"","info":"","title":"Try SMART-MAP!","x":200,"y":200},
                {"id":10,"tax_id":"","gene_id":"","name":"","info":"","title":"This is tnsA","x":425,"y":-25},
                {"id":11,"tax_id":"","gene_id":"","name":"","info":"","title":"This is bla","x":575,"y":-25},
                {"id":12,"tax_id":"","gene_id":"","name":"","info":"","title":"First choose this","x":350,"y":-100},
                {"id":13,"tax_id":"","gene_id":"","name":"","info":"","title":"Then click PATH-FINDER","x":500,"y":-100},
                {"id":14,"tax_id":"","gene_id":"","name":"","info":"","title":"Finally click this","x":650,"y":-100}
                ],"edges":[
                {"source":4,"target":5},
                {"source":3,"target":6},
                {"source":2,"target":3},
                {"source":6,"target":9},
                {"source":10,"target":7},
                {"source":11,"target":8},
                {"source":0,"target":1},
                {"source":1,"target":2},
                {"source":12,"target":7},
                {"source":14,"target":8}
                ]}'''
            pano.new('Welcome to BioHub', welcome, 'false', '', user=user.id)
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
        elif request['action'] == 'get_user_data_by_id':
            if not current_user.is_authenticated:
                return {'success': False, 'error': 'Not logged in'}
            else:
                u=User.get_user_by_id(int(request['user_id']))
                if u:
                    d = {'success': True}
                    d['id'] = u.id
                    d['user_email'] = u.email
                    d['user_name'] = u.username
                    d['avt_src'] = u.avatar
                    d['description'] = u.description
                    d['education'] = u.education
                    d['major'] = u.major
                    return d
                else:
                    return {'success': False, 'error': 'No such user'}
        elif request['action'] == 'head_change':
            if not current_user.is_authenticated:
                return {'success': False, 'error': 'Not logged in'}
            else:
                current_user.avatar = request['data']
                session.add(current_user)
                session.commit()
                return {'success': True}
        elif request['action'] == 'edit_profile':
            if not current_user.is_authenticated:
                return {'success': False, 'error': 'Not logged in'}
            else:
                current_user.username = request['username']
                current_user.description = request['description']
                current_user.education = request['education']
                current_user.major = request['major']
                session.add(current_user)
                session.commit()
                return {'success': True}
        else:
            return {'success': False, 'error': 'Unknown action'}

    def unload(self):
        print('user plugin unloaded')


__plugin__ = user_model()
