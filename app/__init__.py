#!/usr/bin/env python3
# encoding: utf-8

from flask import Flask
from flask_login import LoginManager, current_user
import os
import sys

app = Flask(__name__)
app.config.from_object('config')
if os.getenv('FLASK_TESTING'):
    app.config['DATABASE_URI'] = 'sqlite://'  # in memory
    print('Using temp database in memory', file=sys.stderr)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'user.login'

from models import User
from database import session, TableBase, engine


@login_manager.user_loader
def load_user(user_id):
    return session.query(User).get(user_id)


from app.views import *

app.register_blueprint(home, url_prefix='')
app.register_blueprint(plugin, url_prefix='/plugin')

TableBase.metadata.create_all(engine)

from plugin import plugin_manager

with app.app_context():
    plugin_manager.load_plugin('plugins')
