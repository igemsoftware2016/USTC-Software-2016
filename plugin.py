"""Everything about plugins."""

import importlib

import app
from database import session
from models import Document, PluginDocument


class Plugin:
    def __init__(self):
        self.documents = Documents(self)
        self.name = self.__class__.__name__.lower()
        if self.__class__ is Plugin:
            raise NotImplementedError

    @property
    def user(self):
        return app.current_user

    def process(self, request):
        pass

    def unload(self):
        pass


class PluginManager:
    plugin_directory = 'plugins'

    def __init__(self):
        self.plugins = {}
        self.modules = {}

    # now reload and unload are very unstable, do not use
    # FIXME: [wzb@07-31] if plugin is in a directory, reload can only reload the __init__.py

    def load_plugin(self, name, reload=False):
        if name in self.plugins:
            if reload:
                self.modules[name] = importlib.reload(self.modules[name])
                self.plugins[name] = self.modules[name].__plugin__
            return self.plugins[name]
        self.modules[name] = importlib.import_module(self.plugin_directory + '.' + name)
        self.plugins[name] = self.modules[name].__plugin__
        return self.plugins[name]

    def get_plugins(self):
        return self.plugins

    def send_request(self, plugin, request):
        if plugin not in self.plugins:
            return {'success': False, 'reason': 'plugin not found'}
        try:
            rtv = self.plugins[plugin].process(request)
            if 'success' not in rtv:
                rtv['success'] = True
        except Exception as e:
            rtv = {'success': False, 'reason': type(e).__name__ + ': ' + str(e)}
        return rtv


plugin_manager = PluginManager()


class Documents:
    def __init__(self, plugin: Plugin):
        self.plugin = plugin
        self.type_name = None
        self.document_table = None

    def set_document_type(self, name: str):
        self.type_name = name

    def set_document_table(self, table):
        self.document_table = table

    def get(self, pid):
        return session.query(self.document_table).get(pid)

    def list(self, owner):
        return session.query(self.document_table).filter(self.document_table.owner == owner).all()

    def create(self, pdoc: PluginDocument):
        session.add(pdoc)
        session.commit()
        doc = Document(self.plugin.name, pdoc)
        session.add(doc)
        session.commit()

    @staticmethod
    def update(pdoc: PluginDocument):
        session.add(pdoc)
        session.commit()

    def delete(self, pdoc: PluginDocument):
        doc = session.query(Document).filter(Document.plugin_name == self.plugin.name,
                                             Document.plugin_document_id == pdoc.id).one()
        session.delete(doc)
        session.delete(pdoc)
        session.commit()
