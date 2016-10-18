import unittest
import os
import json
import tempfile

os.environ['FLASK_TESTING'] = '1'

import app


class FlaskTestCase(unittest.TestCase):
    def setUp(self):
        app.app.config['TESTING'] = True
        self.app = app.app.test_client()
        # with app.app.app_context():
        #    app.init_db()

    def tearDown(self):
        pass

    def post(self, url, data):
        return json.loads(self.app.post(url, data=data).data.decode("utf-8"))

    def call_plugin(self, **data):
        return self.post('/plugin/', data)

    def test_user(self):
        # root
        rv = self.app.get('/')
        assert b'redirect' in rv.data

        # register
        rv = self.call_plugin(plugin='user_model', action='create_user', email='e', password='123', username='u')
        assert rv['success']

        # email already exists
        rv = self.call_plugin(plugin='user_model', action='create_user', email='e', password='123', username='u')
        assert not rv['success']

        # wrong password
        rv = self.call_plugin(plugin='user_model', action='validate_login', email='e', password='1234')
        assert not rv['success']

        # wrong email
        rv = self.call_plugin(plugin='user_model', action='validate_login', email='e2', password='123')
        assert not rv['success']

        # successful login
        rv = self.call_plugin(plugin='user_model', action='validate_login', email='e', password='123')
        assert rv['success']

        # edit profile
        rv = self.call_plugin(plugin='user_model', action='edit_profile', username='t1', description='t2', education='t3', major='t4')
        assert rv['success']

        # get profile
        rv = self.call_plugin(plugin='user_model', action='get_user_data')
        assert rv['username'] == 't1'

    def test_version(self):
        rv = self.call_plugin(plugin='version')
        assert rv['success']

    def test_biobrick(self):
        rv = self.call_plugin(plugin='biobrick_manager', action='search', key='a')
        assert rv['success'] and len(rv['list']) > 50

    def test_pano(self):
        self.call_plugin(plugin='user_model', action='create_user', email='pano1@test', password='x', username='pano1_test')
        self.call_plugin(plugin='user_model', action='create_user', email='pano2@test', password='x', username='pano2_test')
        self.call_plugin(plugin='user_model', action='validate_login', email='pano1@test', password='x')
        rv = self.call_plugin(plugin='pano', action='new', title='a_title', data='a_data', public='false', img='a_img')
        assert rv['success']
        a = rv['id']
        rv = self.call_plugin(plugin='pano', action='new', title='b_title', data='b_data', public='true', img='b_img')
        assert rv['success']
        b = rv['id']
        rv = self.call_plugin(plugin='pano', action='list')
        assert rv['success'] and set(rv['ids']) == {a, b}
        rv = self.call_plugin(plugin='pano', action='get_event_data')
        assert rv['success'] and len(rv['events']) == 1 and rv['events'][0]['project_id'] == b
        rv = self.call_plugin(plugin='pano', action='load', id=str(a))
        assert rv['success'] and not rv['public']
        rv = self.call_plugin(plugin='pano', action='save', id=str(a), title='a_new_title', data='a_data', img='a_img')
        assert rv['success']
        rv = self.call_plugin(plugin='pano', action='load', id=str(a))
        assert rv['success'] and rv['title'] == 'a_new_title'
        rv = self.call_plugin(plugin='pano', action='delete', id=str(a))
        assert rv['success']
        rv = self.call_plugin(plugin='pano', action='load', id=str(a))
        assert not rv['success']
        rv = self.call_plugin(plugin='pano', action='list')
        assert rv['success'] and set(rv['ids']) == {b}
        rv = self.call_plugin(plugin='pano', action='new', title='c_title', data='c_data', public='false', img='c_img')
        assert rv['success']
        c = rv['id']
        self.call_plugin(plugin='user_model', action='validate_login', email='pano2@test', password='x')
        rv = self.call_plugin(plugin='pano', action='get_event_data')
        assert rv['success'] and len(rv['events']) == 1 and rv['events'][0]['project_id'] == b
        # FIXME Hypercube


if __name__ == '__main__':
    unittest.main()
