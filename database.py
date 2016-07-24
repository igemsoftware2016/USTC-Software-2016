from config import database_path

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, ForeignKey, Integer, String

Base = declarative_base()


class Node(Base):
    __tablename__ = 'node'
    node_id = Column(String(256), primary_key=True)
    node_name = Column(String(256))
    node_catalog = Column(String(256))


class Link(Base):
    __tablename__ = 'link'
    link_id = Column(String(256), primary_key=True)
    node_a_id = Column(String(256), ForeignKey('node.node_id'))
    node_b_id = Column(String(256), ForeignKey('node.node_id'))
    link_catalog = Column(String(256))
    link_name = Column(String(256))


engine = create_engine(database_path)

DBSession = sessionmaker(bind=engine)
