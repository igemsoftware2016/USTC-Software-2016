from Bio.Blast import NCBIWWW
from Bio import SearchIO


def BLAST(seq, program='blastn', database='nt'):
    return SearchIO.read(NCBIWWW.qblast(program, database, seq), 'blast-xml')
