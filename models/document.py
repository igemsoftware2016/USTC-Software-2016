from .plugin_document import PluginDocument
from database import TableBase, Column, Integer, String, ForeignKey


class Document(TableBase):
    """An object refer to an actual plugin-managed document.

    Every actual document is not only saved in plugins' table, but also has an entry here, so that we can easily get all documents belong to a specific user."""

    __tablename__ = 'document'

    def __init__(self, plugin_name: str, doc: PluginDocument):
        super().__init__()
        self.owner = doc.owner
        self.plugin_name = plugin_name
        self.plugin_document_id = doc.id

    document_id = Column(Integer(), primary_key=True)
    owner = Column(Integer(), ForeignKey('user.id'))
    plugin_name = Column(String(256))
    plugin_document_id = Column(Integer())
