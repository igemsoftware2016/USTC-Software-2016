from config import DATABASE_URI

from sqlalchemy import *
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base


TableBase = declarative_base()
engine = create_engine(DATABASE_URI)
DBSession = sessionmaker(bind=engine)
session = DBSession()
