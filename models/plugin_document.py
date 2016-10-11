from sqlalchemy.ext.declarative import declared_attr

from database import Column, Integer, String, ForeignKey, Text


class PluginDocument(object):
    """Abstract class for all plugins to make their own document type."""

    def __init__(self):
        super().__init__()
        if self.__class__ is PluginDocument:
            raise NotImplementedError

    id = Column(Integer(), primary_key=True)
    @declared_attr
    def owner(cls):
        return Column(Integer(), ForeignKey('user.id'))
    title = Column(String(256))
    last_modified = Column(Integer())
    description = Column(Text())
