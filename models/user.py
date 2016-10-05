from database import TableBase, Column, Integer, String, session, Text
from flask_login import UserMixin
import hashlib
import random
import string


def random_string(N):
    return ''.join(random.choice(string.ascii_uppercase + string.ascii_lowercase + string.digits) for i in range(N))


class User(TableBase, UserMixin):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True)
    email = Column(String(63), unique=True)
    passwordhash = Column(String(127), nullable=False)
    salt = Column(String(127), nullable=False)
    username = Column(String(127))
    avatar = Column(Text(1048575))
    description = Column(Text(65535))
    education = Column(Text(65535))
    major = Column(Text(65535))

    def __init__(self, email, password, username):
        self.email = email
        self.set_password(password)
        self.username = username

    def set_password(self, password):
        self.salt = random_string(10)
        s = hashlib.sha256()
        s.update(password.encode('utf-8'))
        s.update(self.salt.encode('utf-8'))
        self.passwordhash = s.hexdigest()

    def check_password(self, password):
        s = hashlib.sha256()
        s.update(password.encode('utf-8'))
        s.update(self.salt.encode('utf-8'))
        return self.passwordhash == s.hexdigest()

    @classmethod
    def get_user_by_email(cls, email):
        return session.query(cls).filter_by(email=email).first()

    @classmethod
    def get_user_by_id(cls, id):
        return session.query(cls).get(id)
