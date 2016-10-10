from database import TableBase, Column, ForeignKey, INTEGER, VARCHAR


class FeatureOfficial(TableBase):
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
