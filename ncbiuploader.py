from plugins.dbupload.uploaddb import upload
from plugins.dbupload.dbprofile import *
from config import DATABASE_URI

'''
Change filepath = your data file from ncbi
Change column_num = Column number of data file
'''

filepath = r""
column_num = 0

if not DATABASE_URI.startswith('mysql+pymysql://'):
    DATABASE_URI = 'mysql+pymysql://'+DATABASE_URI.split('://')[1]
upload(DATABASE_URI, filepath, gene_commit, column_num, cache_size=100000, echo=True, log=True)
