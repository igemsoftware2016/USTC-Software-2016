"""This is an example plugin for BioHub. It manages all text files, and print some debug messages."""


from plugin import Plugin, PluginDocument

from database import TableBase, Column, Text
from database import engine


class TextFileDocument(TableBase, PluginDocument):

    __tablename__ = 'textfile'

    def __init__(self, owner, title='Untitled', text=''):
        super().__init__()
        self.owner = owner
        self.title = title
        self.text = text
        self.description = 'not support description'

    text = Column(Text())


class TextFile(Plugin):
    def __init__(self):
        super().__init__()
        print('example plugin loaded')
        self.documents.set_document_type('text')
        self.documents.set_document_table(TextFileDocument)
        self.name = 'example_plugin'
        try:
            TextFileDocument.__table__.create(engine)
        except:
            pass

    def process(self, request):
        print('example plugin got a request:' + str(request))
        if request['action'] == 'new':
            doc = TextFileDocument(self.user.user_id)
            self.documents.create(doc)
            return {'id': doc.id}
        elif request['action'] == 'save':
            doc = self.documents.get(request['id'])
            doc.title = request['title']
            doc.text = request['text']
            self.documents.update(doc)
            return {}
        elif request['action'] == 'delete':
            doc = self.documents.get(request['id'])
            self.documents.delete(doc)
            return {}
        elif request['action'] == 'get':
            doc = self.documents.get(request['id'])
            return {'id': doc.id, 'owner': doc.owner, 'title': doc.title, 'text': doc.text,
                    'last_modified': doc.last_modified}
        else:
            return {'success': False, 'reason': 'unknown action: ' + request['action']}

    def unload(self):
        print('example plugin unloaded')

__plugin__ = TextFile()
