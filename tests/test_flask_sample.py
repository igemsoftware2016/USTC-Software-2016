import unittest
import os
import json
import tempfile

os.environ['FLASK_TESTING'] = '1'

import app


class FlaskrTestCase(unittest.TestCase):
    def setUp(self):
        app.app.config['TESTING'] = True
        self.app = app.app.test_client()
        # with app.app.app_context():
        #    app.init_db()

    def tearDown(self):
        pass

    def post(self, url, data):
        return json.loads(self.app.post(url, data=data).data.decode("utf-8"))

    def test_user(self):
        # root
        rv = self.app.get('/')
        assert b'redirect' in rv.data

        # register
        rv = self.post('/plugin/', data={
            'plugin': 'user_model',
            'action': 'create_user',
            'email': 'e',
            'password': '123',
            'username': 'u'
        })
        assert rv['success']

        # email already exists
        rv = self.post('/plugin/', data={
            'plugin': 'user_model',
            'action': 'create_user',
            'email': 'e',
            'password': '123',
            'username': 'u'
        })
        assert not rv['success']

        # wrong password
        rv = self.post('/plugin/', data={
            'plugin': 'user_model',
            'action': 'validate_login',
            'email': 'e',
            'password': '1234'
        })
        assert not rv['success']

        # wrong email
        rv = self.post('/plugin/', data={
            'plugin': 'user_model',
            'action': 'validate_login',
            'email': 'e2',
            'password': '123'
        })
        assert not rv['success']

        # successful login
        rv = self.post('/plugin/', data={
            'plugin': 'user_model',
            'action': 'validate_login',
            'email': 'e',
            'password': '123'
        })
        assert rv['success']

        # edit profile
        rv = self.post('/plugin/', data={
            'plugin': 'user_model',
            'action': 'edit_profile',
            'username': 't1',
            'description': 't2',
            'education': 't3',
            'major': 't4'
        })
        assert rv['success']

        # get profile
        rv = self.post('/plugin/', data={
            'plugin': 'user_model',
            'action': 'get_user_data',

        })
        assert rv['username'] == 't1'


if __name__ == '__main__':
    unittest.main()
