from os import getenv, remove
from os.path import exists
from time import time

dbhost = getenv('BIOHUB_DB_HOST')
dbpassword = getenv(dbhost.upper() + '_ENV_MYSQL_ROOT_PASSWORD')

if exists('first'):
    import MySQLdb
    c = MySQLdb.connect(dbhost, 'root', dbpassword)
    c.send_query('CREATE DATABASE igem')
    try: c.commit()
    except: pass
    c.close()
    remove('first')

DATABASE_URI = 'mysql://root:%s@%s/igem' % (dbpassword, dbhost)
SECRET_KEY = str(time)
