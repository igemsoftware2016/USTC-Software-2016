from time import time

from plugin import Plugin, PluginDocument

from database import TableBase, Column, Text, Integer, Boolean
from database import engine, session


class PanoDocument(TableBase, PluginDocument):

    __tablename__ = 'pano'

    def __init__(self, owner, title='Untitled', text=''):
        super().__init__()
        self.owner = owner
        self.title = title
        self.text = text
        self.description = 'not support description'
    text = Column(Text())
    created = Column(Integer())
    public = Column(Boolean())
    comments = Column(Text())
    praises = Column(Text())


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
        return getattr(self, request['action'])(**request)

    def new(self, title, data, public, img, **kwargs):
        doc = PanoDocument(self.user.id, title, data)
        doc.description = img
        doc.created = time()
        doc.last_modified = time()
        public = 1 if public else 0
        doc.public = public
        doc.comments = '[]'
        doc.praises = 'set()'
        self.documents.create(doc)
        return dict(id=doc.id)

    def save(self, id, title, data, img, **kwargs):
        id = int(id)
        doc = self.documents.get(id)
        if not (doc and doc.owner == self.user.id):
            raise ValueError('Document %d does not exists.' % id)
        doc.title = title
        doc.text = data
        doc.description = img
        doc.last_modified = time()
        self.documents.update(doc)
        return {}

    def list(self, **kwargs):
        docs = self.documents.list(self.user.id)
        return dict(ids=list(map(lambda x:x.id, docs)))

    def load(self, id, **kwargs):
        id = int(id)
        doc = self.documents.get(id)
        if not (doc and (doc.owner == self.user.id or doc.public)):
            raise ValueError('Document %d does not exists.' % id)
        return dict(data=doc.text, title=doc.title, owner=doc.owner.id, ctime=doc.created, mtime=doc.last_modified,
                public=doc.public, comments=eval(doc.comments), praises=len(eval(doc.praises)), img=doc.description)

    def delete(self, id, **kwargs):
        id = int(id)
        doc = self.documents.get(id)
        if not (doc and doc.owner == self.user.id):
            raise ValueError('Document %d does not exists.' % id)
        self.documents.delete(doc)
        return {}

    def get_event_data(self, **kwargs):
        events = []
        for i in session.query(PanoDocument).filter(PanoDocument.created > time()-7*24*3600).all():
            if(i.owner != self.user.id and i.public):
                events.append(dict(project_id=i.id, user_id=i.owner, time=i.created, img_src=i.description, state='Create',
                        project_name=i.title, last_update_time=i.last_modified, praise=self.user.id in eval(i.praises),
                        comment=eval(i.comments)))
        for i in session.query(PanoDocument).filter(PanoDocument.last_modified > time()-7*24*3600).all():
            if(i.owner != self.user.id and i.public):
                events.append(dict(project_id=i.id, user_id=i.owner, time=i.created, img_src=i.description, state='Update',
                    project_name=i.title, last_update_time=i.last_modified, praise=self.user.id in eval(i.praises),
                    comment=eval(i.comments)))
        return dict(events=events)

    def submit_comment(self, comment, event_id, **kwargs):
        id = int(event_id)
        doc = self.documents.get(id)
        if not (doc and (doc.owner == self.user.id or doc.public)):
            raise ValueError('Document %d does not exists.' % id)
        comments = eval(doc.comments)
        comments.append(dict(user_id=self.user.id, content=comment, time=time()))
        doc.comments = repr(comments)
        self.documents.update(doc)
        return {}

    def submit_praise(self, modify, event_id, **kwargs):
        modify = modify=='true' if type(modify) is str else bool(modify)
        id = int(event_id)
        doc = self.documents.get(id)
        if not (doc and (doc.owner == self.user.id or doc.public)):
            raise ValueError('Document %d does not exists.' % id)
        praises = eval(doc.praises)
        praises.discard(self.user.id)
        if modify:
            praises.add(self.user.id)
        doc.praises = repr(praises)
        self.documents.update(doc)
        return {}

    def get_project_data(self, **kwargs):
        events = []
        for i in self.documents.list(self.user.id):
            events.append(dict(project_id=i.id, user_id=i.owner, time=i.created, img_src=i.description, public=i.public,
                project_name=i.title, last_update_time=i.last_modified, praise=self.user.id in eval(i.praises),
                comment=eval(i.comments)))
        return dict(project=events)

__plugin__ = Pano()
