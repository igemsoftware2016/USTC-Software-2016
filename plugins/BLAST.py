from Bio.Blast import NCBIWWW
from Bio import SearchIO

from plugin import Plugin


def BLAST(seq, program='blastn', database='nt'):
    return SearchIO.read(NCBIWWW.qblast(program, database, seq), 'blast-xml')

class Blast(Plugin):
    name = 'BLAST'

    def process(self, request):
        result = []
        for i in BLAST(request['seq'].upper()):
            l = str(i).split('\n')[-1].split()
            q = l[4].replace('[', '').replace(']', '').split(':')
            h = l[5].replace('[', '').replace(']', '').split(':')
            result.append(dict(ID=i.id, description=i.description, evalue=float(l[1]), score=float(l[2]),
                    span=int(l[3]), query_start=int(q[0]), query_end=int(q[1]), hit_start=int(h[0]), hit_end=int(h[1])))
        return dict(result=result)

__plugin__ = Blast()
