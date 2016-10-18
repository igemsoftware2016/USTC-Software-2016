from sqlalchemy import Column, Text, Integer, Date, String
from database import TableBase
from __init__ import *


# Define database file error exception
class DataBaseSourceError(Exception):
    pass

# define biosystems of certain taxonomy
class biosys_single(TableBase):
    __tablename__ = 'biosys_562'
    id = Column(Integer, primary_key=True, autoincrement=True)
    tax_id = Column(String(10))
    gene_id = Column(String(10))
    bsid = Column(Integer)
    Symbol = Column(String(64))

# define Gene
class Gene(TableBase):
    __tablename__ = 'allgeneinfo_all'
    tax_id = Column(String(10))
    gene_id = Column(String(10), primary_key=True)
    Symbol = Column(String(64))
    LocusTag = Column(Text)
    Synonyms = Column(Text)
    dbXrefs = Column(Text)
    chromosome = Column(Text)
    map_location = Column(Text)
    description = Column(Text)
    type_of_gene = Column(Text)
    Symbol_from_nomenclature_authority = Column(Text)
    Full_name_from_nomenclature_authority = Column(Text)
    Nomenclature_status = Column(Text)
    Other_designations = Column(Text)
    Modification_date = Column(Date)


def gene_init(oneline):
    try:
        if len(oneline) != 15:
            raise DataBaseSourceError
    finally:
        pass

    day = ''.join(oneline[14])
    day = day[0:4] + '-' + day[4:6] + '-' + day[6:8]
    new_gene = Gene(
        tax_id=''.join(oneline[0]),
        gene_id=''.join(oneline[1]),
        Symbol=''.join(oneline[2]),
        LocusTag=''.join(oneline[3]),
        Synonyms=''.join(oneline[4]),
        dbXrefs=''.join(oneline[5]),
        chromosome=''.join(oneline[6]),
        map_location=''.join(oneline[7]),
        description=''.join(oneline[8]),
        type_of_gene=''.join(oneline[9]),
        Symbol_from_nomenclature_authority=''.join(oneline[10]),
        Full_name_from_nomenclature_authority=''.join(oneline[11]),
        Nomenclature_status=''.join(oneline[12]),
        Other_designations=''.join(oneline[13]),
        Modification_date=day)

    return new_gene


def gene_commit(e_e, res, num):
    if len(res) == 0:
        return None

    date = []
    for oneline in res:
        try:
            date.append(oneline[14][0:4] + '-' + oneline[14][4:6] + '-' + oneline[14][6:8])
        except IndexError as e:
            print(e)
            continue

    e_e(
        Gene.__table__.insert(),
        [dict(tax_id=res[i][0],
              gene_id=res[i][1],
              Symbol=res[i][2],
              LocusTag=res[i][3],
              Synonyms=res[i][4],
              dbXrefs=res[i][5],
              chromosome=res[i][6],
              map_location=res[i][7],
              description=res[i][8],
              type_of_gene=res[i][9],
              Symbol_from_nomenclature_authority=res[i][10],
              Full_name_from_nomenclature_authority=res[i][11],
              Nomenclature_status=res[i][12],
              Other_designations=res[i][13],
              Modification_date=date[i])
         for i in range(len(res))]
    )


# ===========================BioSystems====================================
class BioSys(TableBase):
    __tablename__ = 'biosystems'

    id = Column(Integer, primary_key=True, autoincrement=True)
    bsid = Column(Integer)
    gene_id = Column(String(10))
    score = Column(Integer)


def biosys_init(oneline):
    try:
        if len(oneline) != 3:
            raise DataBaseSourceError
    finally:
        pass

    try:
        score_int = int(oneline[2])
    except ValueError:
        return None

    return BioSys(
        bsid=''.join(oneline[0]),
        gene_id=''.join(oneline[1]),
        score=score_int)


def biosys_commit(e_e, res, num):
    if len(res) == 0:
        return None

    error_pos = []
    score_int = []
    bs_id_int = []
    for i in range(0, len(res)):
        try:
            temp1 = int(res[i][2])
            temp2 = int(res[i][0])
        except ValueError as e:
            print('\nIn row', str(num - len(res) + i + 1) + ',', e)
            error_pos.append(i)
        else:
            score_int.append(temp1)
            bs_id_int.append(temp2)

    for i in error_pos:
        del res[i]

    e_e(
        BioSys.__table__.insert(),
        [dict(bsid=bs_id_int[i],
              gene_id=res[i][1],
              score=score_int[i])
         for i in range(len(res))]
    )
