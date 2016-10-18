from .document import Document
from .plugin_document import PluginDocument
from .node import Node
from .link import Link
from .user import User

"""Each table in the database and not belonged to a plugin has a model here, so that we can use SQLAlchemy to connect to the database."""