"""Everything about plugins."""


import importlib

import app
from database import session
from models import Document, PluginDocument


class Plugin:
    def __init__(self):
        self.documents = Documents(self)
        self.name = self.__class__.__name__
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

    def __init__(self):
        self.plugins = {}

    # now reload and unload are very unstable, do not use

    def load_plugin(self, name, reload=False):
        if name in self.plugins:
            if reload:
                try:
                    self.plugins[name] = importlib.reload(importlib.import_module(name)).__plugin__
                except:
                    pass
            return self.plugins[name]
        try:
            self.plugins[name] = importlib.import_module(name).__plugin__
        except:
            return None
        return self.plugins[name]

    def unload_plugin(self, name, force=False):
        if name in self.plugins:
            try:
                result = self.plugins[name].unload()
            except:
                result = False
            if result or force:
                del self.plugins[name]
                return True
        return False

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
            rtv = {'success': False, 'reason': str(e)}
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
        pdoc = session.query(self.document_table).filter(self.document_table.id == pid).first()
        return pdoc

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
        doc = session.query(Document).filter(Document.plugin_name == self.plugin.name
                                             and Document.plugin_document_id == pdoc.id).first()
        session.delete(doc)
        session.delete(pdoc)
        session.commit()
