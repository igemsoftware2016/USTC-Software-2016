from database import TableBase, Column, String, ForeignKey, Integer


class Link(TableBase):
    __tablename__ = 'link'
    link_id = Column(Integer, primary_key=True, autoincrement=True)
    tax_id = Column(String(10))
    node_a_id = Column(String(10))
    node_b_id = Column(String(10))
    link_catalog = Column(String(256))
    link_name = Column(String(256))
