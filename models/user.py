from database import TableBase, Column, Integer, String


class User(TableBase):
    __tablename__ = 'user'
    user_id = Column(Integer(), primary_key=True)
    user_name = Column(String(32))
    user_pass_hash = Column(String(256), default='x:x')
