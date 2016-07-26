from database import TableBase, Column, String, ForeignKey


class Link(TableBase):
    __tablename__ = 'link'
    link_id = Column(String(256))
    node_a_id = Column(String(256), ForeignKey('node.node_id'), primary_key=True)
    node_b_id = Column(String(256), ForeignKey('node.node_id'), primary_key=True)
    link_catalog = Column(String(256))
    link_name = Column(String(256))
