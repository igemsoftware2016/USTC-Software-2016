from plugins.dbupload.uploaddb import upload
from plugins.dbupload.dbprofile import *
from config import DATABASE_URI

'''
Change filepath = your data file from ncbi
Change column_num = Column number of data file
'''

filepath = r""
column_num = 0

DATABASE_URI = DATABASE_URI.replace("mysql", "mysql+pymysql")
upload(DATABASE_URI, filepath, gene_commit, column_num, cache_size=100000, echo=True, log=True)
