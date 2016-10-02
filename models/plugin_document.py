from sqlalchemy.ext.declarative import declared_attr

from database import Column, Integer, String, DateTime, ForeignKey


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
    last_modified = Column(DateTime())
    description = Column(String(1024))
