from plugin import Plugin
from database import session

from .BiobrickOfficial import BiobrickOfficial
#from .FeatureOfficial import FeatureOfficial


class BiobrickManager(Plugin):
    def __init__(self):
        super().__init__()
        self.documents.set_document_type('biobrick')
        self.documents.set_document_table(BiobrickOfficial)
        self.name = 'biobrick_manager'

    def process(self, request):
        return getattr(self, request['action'])(**request)

    def search(self, key, **kwargs):
        filter_str = 'concat(part_name, short_desc, description, notes) like "%%%s%%"' % key
        q = session.query(BiobrickOfficial).filter(filter_str).limit(100)
        return dict(list=repr(list(map(BiobrickOfficial.__get_info__, q))))
    '''
        doc = Biobrick()
        doc.__set_by_kwargs__(**values)
            self.documents.create(doc)
            return {'id': doc.id}

        elif request['action'] == 'basic_edit':
            doc = self.documents.get(request['id'])
            doc.__set_by_kwargs__(**request['values'])
            self.documents.update(doc)
            return {}
        elif request['action'] == 'feature_edit':
            feature = session.query(BioBrickFeature).get(request['id'])
            feature.__set_by_kwargs__(**request['values'])
            session.add(feature)
            session.commit()
            return {}
        elif request['action'] == 'delete':
            # doc = self.documents.get(request['id'])
            # self.documents.delete(doc)
            raise NotImplementedError('delete not supported')
        elif request['action'] == 'get':
            doc = self.documents.get(request['id'])
            return {'values': repr(doc.__get_info__())}
        elif request['action'] == 'search':
            # FIXME: [wzb@08-04]
            filter_str = 'concat(part_name, short_desc, description, notes) like "%%%s%%"' % request['key']
            q = session.query(Biobrick).filter(filter_str)
            return {'list': repr(list(map(Biobrick.__get_info__, q)))}
        else:
            raise ValueError('unknown action: ' + request['action'])
    '''

__plugin__ = BiobrickManager()
