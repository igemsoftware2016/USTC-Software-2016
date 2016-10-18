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
            pano.new('Welcome to BioHub', '''{"nodes": [{"id": 0, "tax_id": "13616", "gene_id": "100020764", "name": "FLI1",
                "info": "Fli-1 proto-oncogene, ETS transcription factor", "title": "A node", "x": 933.3165774794857,
                "y": -364.55292732753173}, {"id": 1, "tax_id": "8364", "gene_id": "100124738", "name": "fli1",
                "info": "Fli-1 proto-oncogene, ETS transcription factor", "title": "Another node",
                "x": 1156.8635397010025, "y": -349.7444343781135},
                {"id": 2, "tax_id": "13616", "gene_id": "100012952", "name": "PLIN1", "info": "perilipin 1",
                    "title": "Path source", "x": 860.299932050852, "y": -206.6094206862168},
                {"id": 3, "tax_id": "13616", "gene_id": "100023154", "name": "PLIN4", "info": "perilipin 4",
                    "title": "Path destination", "x": 1203.4761227806162, "y": -179.53634673455198},
                {"id": 4, "tax_id": "9986", "gene_id": "100008883", "name": "GABARAP",
                    "info": "GABA type A receptor-associated protein", "title": "Hold shift to create links!",
                    "x": 1057.5971402365803, "y": -493.90246288635706},
                {"id": 5, "tax_id": "9986", "gene_id": "100008883", "name": "GABARAP",
                    "info": "GABA type A receptor-associated protein", "title": "Use PATH FINDER to find a path!",
                    "x": 1030.2078023732358, "y": -109.43012156446206}], "edges": [{"source": 0, "target": 1}]}''', 'false', '', user=user.id)
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
