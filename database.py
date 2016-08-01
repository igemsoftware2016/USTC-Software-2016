from config import DATABASE_URI

from sqlalchemy import *
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import sys

TableBase = declarative_base()
engine = create_engine(DATABASE_URI)
DBSession = sessionmaker(bind=engine)

if 'app' in sys.modules:
    print('database imported in flask')

    from flask import g
    from app import app


    def get_session():
        s = getattr(g, '_dbsession', None)
        if s is None:
            s = g._dbsession = DBSession()
            print('new session')
        else:
            print('get session')
        return s


    @app.teardown_appcontext
    def teardown_session(exception):
        s = getattr(g, '_dbsession', None)
        if s is not None:
            s.close()
            print('close session')


    from werkzeug.local import LocalProxy

    session = LocalProxy(get_session)

else:
    print('database imported outside flask')
    session = DBSession()
