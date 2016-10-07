from Bio.Blast import NCBIWWW
from Bio import SearchIO

#from plugin import Plugin


def BLAST(seq, program='blastn', database='nt'):
    return SearchIO.read(NCBIWWW.qblast(program, database, seq), 'blast-xml')

'''
class Blast(Plugin):
    name = 'BLAST'

    def process(self, request):
        pass
'''
