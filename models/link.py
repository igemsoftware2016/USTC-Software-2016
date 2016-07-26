from database import TableBase, Column, String, ForeignKey


class Link(TableBase):
    __tablename__ = 'link'
    link_id = Column(String(256), primary_key=True)
    node_a_id = Column(String(256), ForeignKey('node.node_id'))
    node_b_id = Column(String(256), ForeignKey('node.node_id'))
    link_catalog = Column(String(256))
    link_name = Column(String(256))
