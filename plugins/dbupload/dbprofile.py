from sqlalchemy import Column, Text, Integer, Date, String
from database import TableBase
from __init__ import *


# Define database file error exception
class DataBaseSourceError(Exception):
    pass


# define Gene
class Gene(TableBase):
    __tablename__ = 'allgeneinfo'
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


# ==============Interaction==================
class Interaction(TableBase):
    __tablename__ = 'interactions'

    id = Column(Integer, primary_key=True, autoincrement=True)
    tax_id1 = Column(Text)
    gene_id = Column(Text)
    accn_vers1 = Column(Text)
    name1 = Column(Text)
    keyphrase = Column(Text)
    tax_id2 = Column(Text)
    interactant_id1 = Column(Text)
    interactant_id_type1 = Column(Text)
    accn_vers2 = Column(Text)
    name2 = Column(Text)
    complex_id = Column(Text)
    complex_id_type = Column(Text)
    complex_name = Column(Text)
    pubmed_id_list = Column(Text)
    last_mod = Column(Text)
    generif_text = Column(Text)
    interaction_id2 = Column(Text)
    interaction_id_type2 = Column(Text)


def interaction_init(oneline):
    try:
        if len(oneline) != 18:
            raise DataBaseSourceError
    finally:
        pass

    new_interaction = Interaction(
        tax_id1=''.join(oneline[0]),
        gene_id=''.join(oneline[1]),
        accn_vers1=''.join(oneline[2]),
        name1=''.join(oneline[3]),
        keyphrase=''.join(oneline[4]),
        tax_id2=''.join(oneline[5]),
        interactant_id1=''.join(oneline[6]),
        interactant_id_type1=''.join(oneline[7]),
        accn_vers2=''.join(oneline[8]),
        name2=''.join(oneline[9]),
        complex_id=''.join(oneline[10]),
        complex_id_type=''.join(oneline[11]),
        complex_name=''.join(oneline[12]),
        pubmed_id_list=''.join(oneline[13]),
        last_mod=''.join(oneline[14]),
        generif_text=''.join(oneline[15]),
        interaction_id2=''.join(oneline[16]),
        interaction_id_type2=''.join(oneline[17]))

    return new_interaction


def interaction_commit(e_e, res, num):
    if len(res) == 0:
        return None

    e_e(
        Interaction.__table__.insert(),
        [dict(tax_id1=res[i][0],
              gene_id=res[i][1],
              accn_vers1=res[i][2],
              name_1=res[i][3],
              keyphrase=res[i][4],
              tax_id2=res[i][5],
              interactant_id1=res[i][6],
              interactant_id_type1=res[i][7],
              accn_vers2=res[i][8],
              name2=res[i][9],
              complex_id=res[i][10],
              complex_id_type=res[i][11],
              complex_name=res[i][12],
              pubmed_id_list=res[i][13],
              last_mod=res[i][14],
              generif_text=res[i][15],
              interaction_id2=res[i][16],
              interaction_id_type2=res[i][17])
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


# ==============bsid_info====================
class BsID(TableBase):
    __tablename__ = 'bsidinfo'

    bsid = Column(Integer, primary_key=True)
    source = Column(Text)
    id_in_db = Column(Text)
    name_in_db = Column(Text)
    category = Column(Text)
    organism_specific = Column(Text)
    tax_id = Column(String(10))
    description = Column(Text)


def bsid_commit(e_e, res, num):
    if len(res) == 0:
        return None

    error_pos = []
    bs_id_int = []
    for i in range(0, len(res)):
        try:
            temp2 = int(res[i][0])
        except ValueError as e:
            print('\nIn row', str(num - len(res) + i + 1) + ',', e)
            error_pos.append(i)
        else:
            bs_id_int.append(temp2)

    for i in error_pos:
        del res[i]

    e_e(
        BsID.__table__.insert(),
        [dict(bsid=bs_id_int[i],
              source=res[i][1].encode('utf-8'),
              id_in_db=res[i][2].encode('utf-8'),
              name_in_db=res[i][3].encode('utf-8'),
              category=res[i][4].encode('utf-8'),
              organism_specific=res[i][5].encode('utf-8'),
              tax_id=res[i][6].encode('utf-8'),
              description=res[i][7].encode('utf-8'))
         for i in range(len(res))
         ]
    )


# ===============Taxonomy=======================
class Taxonomy(TableBase):
    __tablename__ = 'taxonomy'
    id = Column(Integer, primary_key=True, autoincrement=True)
    bsid = Column(Integer)
    tax_id = Column(String(10))
    score = Column(Integer)


def tax_commit(e_e, res, num):
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
        Taxonomy.__table__.insert(),
        [dict(bsid=bs_id_int[i],
              tax_id=res[i][1],
              score=score_int[i])
         for i in range(len(res))]
    )


# ===============Link===========================
def link_commit(e_e, res, tax):

    e_e(
        Link.__table__.insert(),
        [
            dict(tax_id=tax,
                 node_a_id=oneline[0],
                 node_b_id=oneline[1])
            for oneline in res
        ]
    )


# ==============Node=============================
def node_commit(e_e, res, num):

    e_e(
        Node.__table__.insert(),
        [
            dict(node_id=oneline[0])
            for oneline in res
        ]
    )


# ===============biosys_temp=====================
class BioSys_temp(TableBase):
    __tablename__ = 'biosystems_temp'

    id = Column(Integer, primary_key=True, autoincrement=True)
    bsid = Column(Integer)


def biosys_temp_commit(e_e, res, num=0):
    if len(res) == 0:
        return None

    error_pos = []
    bs_id_int = []
    for i in range(0, len(res)):
        try:
            temp2 = int(res[i])
        except ValueError as e:
            print('\nIn row', str(num - len(res) + i + 1) + ',', e)
            error_pos.append(i)
        else:
            bs_id_int.append(temp2)

    for i in error_pos:
        del res[i]

    e_e(
        BioSys_temp.__table__.insert(),
        [
            dict(bsid=oneline)
            for oneline in bs_id_int
        ]
    )


# ===============taxonomy_temp===================
class Taxonomy_temp(TableBase):
    __tablename__ = 'taxonomy_temp'

    tax_id = Column(String(10), primary_key=True)


def tax_temp_commit(e_e, res, num=0):
    if len(res) == 0:
        return None

    e_e(
        Taxonomy_temp.__table__.insert(),
        [
            dict(tax_id=oneline)
            for oneline in res
        ]
    )
