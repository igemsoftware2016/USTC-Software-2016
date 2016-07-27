#__author__=Eadric_

from Bio.Blast import NCBIWWW
from Bio import SearchIO

import os


def BLAST(Seq,way = 'online',program = 'blastn',database = 'nt'):
	if(way == 'online'): 
		print('waiting...\n')
		result_handle = NCBIWWW.qblast("%s"%program, "%s"%database, "%s"%Seq)
		save_file = open("%s.xml"%Seq, "w")
		save_file.write(result_handle.read())
		save_file.close()
		result_handle.close()

		blast_qresult = SearchIO.read('%s.xml'%Seq, 'blast-xml')
		print(blast_qresult)	
	elif(way == 'local'):
		save_file_in = open("./ncbi-blast-2.4.0+/db/input/%s.txt"%Seq, "w")
		save_file_in.write(Seq)
		save_file_in.close()
		print('waiting...\n')
		os.system('./ncbi-blast-2.4.0+/bin/%s -query ./ncbi-blast-2.4.0+/db/input/%s.txt -db ./ncbi-blast-2.4.0+/db/%s.fasta -out ./ncbi-blast-2.4.0+/db/output/%s.txt'%(program,Seq,database,Seq))
		blast_qresult = SearchIO.read('./ncbi-blast-2.4.0+/db/output/%s.txt'%Seq, 'blast-text')
		print(blast_qresult)	
		

#BLAST(Seq,way='online',program = 'blastn',database = 'nt')
#
#Seq:sequence which you want to blast(GI number is OK too)
#
#way:online or local(online is slow,local is fast)
#
#program:blastn or blastx etc...(can find it in google)
#
#database:same as program
#
#
#./online-output is the output of online blast(.xml)
#./ncbi-blast-2.4.0+/output is the output of local blast(.txt,it's not xml is because of a unknown error,i will try to fix it in the future)
#./ncbi-blast-2.4.0+/db/ is not include all the db(it's several GBs),i just download one of them for test(/db/nt.fasta),if you want to do a #real local blast,please contact me
