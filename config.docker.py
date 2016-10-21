from os import getenv, system
from os.path import exists
from time import time

if getenv('BIOHUB_DB_HOST'):
    dbhost = getenv('BIOHUB_DB_HOST')
else:
    dbhost = 'db'
if getenv('BIOHUB_DB_USER'):
    dbuser = getenv('BIOHUB_DB_USER')
    dbpassword = getenv('BIOHUB_DB_PASSWORD')
else:
    dbuser = 'root'
    dbpassword = getenv(dbhost.upper() + '_ENV_MYSQL_ROOT_PASSWORD')

if not exists('.not_first'):
    import MySQLdb
    c = MySQLdb.connect(dbhost, dbuser, dbpassword)
    c.send_query('CREATE DATABASE igem')
    try: c.commit()
    except: pass
    c.close()
    df = 'biobricks.sql.gz'
    bf = 'biobricks.sql'
    system('wget http://parts.igem.org/partsdb/download.cgi?type=parts_sql -O "%s"' % df)
    system('gunzip "%s"' % df)
    system('mysql "-h%s" "-u%s" "-p%s" "%s" <"%s"' % (dbhost, dbuser, dbpassword, 'igem', bf))
    system('mysql "-h%s" "-u%s" "-p%s" "%s" < ncbi_562.sql' % (dbhost, dbuser, dbpassword, 'igem'))
    with open('.not_first', 'w') as f:
        pass

DATABASE_URI = 'mysql://%s:%s@%s/igem' % (dbuser, dbpassword, dbhost)
SECRET_KEY = str(time)
