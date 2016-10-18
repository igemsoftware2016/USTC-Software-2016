from database import TableBase, Column, String


class Node(TableBase):
    """A bio-part which can be added to biopano."""

    __tablename__ = 'node'
    node_id = Column(String(256), primary_key=True)
    node_name = Column(String(256))
    node_catalog = Column(String(256))
