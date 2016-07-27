from database import TableBase, Column, Integer, String
from flask_login import UserMixin

class User(TableBase, UserMixin):
    __tablename__ = 'user'
    user_id = Column(Integer(), primary_key=True)
    user_name = Column(String(32))
    user_pass_hash = Column(String(256), default='x:x')

    @property
    def id(self):
        """
        patch the `id` attribute for login_manager
        """
        return self.user_id
