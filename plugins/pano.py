from plugin import Plugin, PluginDocument

from database import TableBase, Column, Text
from database import engine


class PanoDocument(TableBase, PluginDocument):

    __tablename__ = 'pano'

    def __init__(self, owner, title='Untitled', text=''):
        super().__init__()
        self.owner = owner
        self.title = title
        self.text = text
        self.description = 'not support description'
    text = Column(Text())


class Pano(Plugin):
    def __init__(self):
        super().__init__()
        self.documents.set_document_type('pano')
        self.documents.set_document_table(PanoDocument)
        self.name = 'biobrick_manager'
        try:
            PanoDocument.__table__.create(engine)
        except:
            pass

    def process(self, request):
        if request['action'] == 'new':
            doc = PanoDocument(self.user.id)
            self.documents.create(doc)
            return dict(id=doc.id)
        elif request['action'] == 'save':
            request['id'] = int(request['id'])
            doc = self.documents.get(request['id'])
            if not (doc and doc.owner == self.user):
                raise ValueError('Document %d does not exists.' % request['id'])
            doc.text = request['data']
            self.documents.update(doc)
            return {}
        elif request['action'] == 'list':
            docs = self.documents.list(self.user)
            return dict(ids=list(map(lambda x:x.id, docs)))
        elif request['action'] == 'load':
            request['id'] = int(request['id'])
            doc = self.documents.get(request['id'])
            if not (doc and doc.owner == self.user):
                raise ValueError('Document %d does not exists.' % request['id'])
            return dict(data=doc.text)
        elif request['action'] == 'delete':
            request['id'] = int(request['id'])
            doc = self.documents.get(request['id'])
            if not (doc and doc.owner == self.user):
                raise ValueError('Document %d does not exists.' % request['id'])
            self.documents.delete(doc)
            return {}
        else:
            raise ValueError('Unknown action: %s' % request['action'])

__plugin__ = Pano()
