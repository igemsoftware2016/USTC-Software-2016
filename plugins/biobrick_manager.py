from plugin import Plugin

from database import TableBase, Column, ForeignKey, \
    Integer, INTEGER, TINYINT, VARCHAR, LONGTEXT, DATE, DATETIME, TEXT, BINARY, DOUBLE
from database import session


class BioBrickSeq(TableBase):
    __tablename__ = 'parts_seq_features'

    feature_id = Column(INTEGER(11), primary_key=True)
    feature_type = Column(VARCHAR(200))
    start_pos = Column(INTEGER(11))
    end_pos = Column(INTEGER(11))
    label = Column(VARCHAR(200))
    part_id = Column(INTEGER(11), ForeignKey('parts.part_id'))
    type = Column(VARCHAR(200))
    label2 = Column(VARCHAR(200))
    mark = Column(INTEGER(11))
    old = Column(INTEGER(11))
    reverse = Column(INTEGER(11))

    def __set_by_kwargs__(self, **kwargs):
        for k, v in kwargs.items():
            setattr(self, k, v)


class Biobrick(TableBase):
    __tablename__ = 'parts'

    part_id = Column(INTEGER(11), primary_key=True)
    ok = Column(TINYINT(1))
    part_name = Column(VARCHAR(255))
    short_desc = Column(VARCHAR(100))
    description = Column(LONGTEXT)
    part_type = Column(VARCHAR(20))
    author = Column(VARCHAR(200))
    owning_group_id = Column(INTEGER(11))
    status = Column(VARCHAR(20))
    dominant = Column(TINYINT(1))
    informational = Column(TINYINT(1))
    discontinued = Column(INTEGER(11))
    part_status = Column(VARCHAR(40))
    sample_status = Column(VARCHAR(40))
    p_status_cache = Column(VARCHAR(1000))
    s_status_cache = Column(VARCHAR(1000))
    creation_date = Column(DATE)
    m_datetime = Column(DATETIME)
    m_user_id = Column(INTEGER(11))
    uses = Column(INTEGER(11))
    doc_size = Column(INTEGER(11))
    works = Column(VARCHAR(10))
    favorite = Column(INTEGER(4))
    specified_u_list = Column(LONGTEXT)
    deep_u_list = Column(LONGTEXT)
    deep_count = Column(INTEGER(11))
    ps_string = Column(LONGTEXT)
    scars = Column(VARCHAR(20))
    default_scars = Column(VARCHAR(20))
    owner_id = Column(INTEGER(11))
    group_u_list = Column(LONGTEXT)
    has_barcode = Column(TINYINT(1))
    notes = Column(LONGTEXT)
    sources = Column(TEXT)
    nickname = Column(VARCHAR(10))
    categories = Column(VARCHAR(500))
    sequence = Column(LONGTEXT)
    sequence_sha1 = Column(BINARY(20))
    sequence_update = Column(INTEGER(11))
    seq_edit_cache = Column(LONGTEXT)
    review_result = Column(DOUBLE(12, 0))
    review_count = Column(INTEGER(4))
    review_total = Column(INTEGER(4))
    flag = Column(INTEGER(4))
    sequence_length = Column(INTEGER(11))
    temp_1 = Column(INTEGER(11))
    temp_2 = Column(INTEGER(11))
    temp_3 = Column(INTEGER(11))
    temp4 = Column(INTEGER(11))
    rating = Column(INTEGER(11))

    id = part_id
    owner = Column(Integer, ForeignKey('user.user_id'))
    title = part_name
    last_modified = m_datetime

    def __set_by_kwargs__(self, **kwargs):
        for k, v in kwargs.items():
            setattr(self, k, v)

    def __get_info__(self):
        values = {}
        for k in dir(self):
            if k.startswith('_'):
                continue
            values[k] = getattr(self, k)
        seqs = []
        for seq in session.query(BioBrickSeq).filter(BioBrickSeq.part_id == self):
            seqs.append({})
            for k in dir(seq):
                if k.startswith('_'):
                    continue
                seqs[-1][k] = getattr(seq, k)
        values['seqs'] = seqs
        return values


class BiobrickManager(Plugin):
    def __init__(self):
        super().__init__()
        self.documents.set_document_type('biobrick')
        self.documents.set_document_table(Biobrick)
        self.name = 'biobrick_manager'

    def process(self, request):
        if request['action'] == 'new':
            doc = Biobrick()
            doc.__set_by_kwargs__(**request['values'])
            self.documents.create(doc)
            return {'id': doc.id}
        elif request['action'] == 'basic_edit':
            doc = self.documents.get(request['id'])
            doc.__set_by_kwargs__(**request['values'])
            self.documents.update(doc)
            return {}
        elif request['action'] == 'seq_edit':
            seq = session.query(BioBrickSeq).get(request['id'])
            seq.__set_by_kwargs__(**request['values'])
            session.add(seq)
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

__plugin__ = BiobrickManager()
