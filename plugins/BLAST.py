# author=Eadric

from Bio.Blast import NCBIWWW
from Bio import SearchIO
from Bio.Blast.Applications import *
import os

INPUTPATH = "./Blast_Input"
OUTPUTPATH = "./Blast_Output"
DBPATH = "./db"


class BLAST:
    def __init__(self, Seq):
        self.Seq = Seq

    def ini(self):
        if (os.path.exists(INPUTPATH) == False):
            os.mkdir(INPUTPATH)
        if (os.path.exists(OUTPUTPATH) == False):
            os.mkdir(OUTPUTPATH)

    def online(self, program='blastn', database='nt'):
        print('waiting...')
        result_handle = NCBIWWW.qblast(program, database, self.Seq)
        save_file = open(OUTPUTPATH + "/%s.xml" % self.Seq, "w")
        save_file.write(result_handle.read())
        save_file.close()

    def local(self, program='blastn', database='mito'):
        save_file_in = open(INPUTPATH + "/%s.fasta" % self.Seq, "w")
        save_file_in.write(self.Seq)
        save_file_in.close()

        INPUTPATH_tmp = INPUTPATH + "/%s.fasta" % self.Seq
        OUTPUTPATH_tmp = OUTPUTPATH + "/%s.xml" % self.Seq

        Str = 'Ncbi%sCommandline(query = INPUTPATH_tmp ,db = database ,out = OUTPUTPATH_tmp,outfmt = 5)' % (program)
        print('waiting...')
        blastx_cline = eval(Str)
        stdout, stderr = blastx_cline()

    def read(self):
        blast_qresult = SearchIO.read(OUTPUTPATH + "/%s.xml" % self.Seq, 'blast-xml')
        print(blast_qresult)

# import BLAST
# a = BLAST.BLAST(Seq)
#
# please a.ini() before using local() or online()
# a.local(program,database)
#
# Seq:sequence which you want to blast(GI number is OK too)
#
# way:online or local(online is slow,local is fast)
#
# program:blastn or blastx etc...(can find it in google)
#
# database:same as program
#
#
#
