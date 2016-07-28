from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Text, Integer, Date, String
# Initialize base
Base = declarative_base()


# Define database file error exception
class DataBaseSourceError(Exception):
    pass


# define Gene
class Gene(Base):
    __tablename__ = 'allgeneinfo'
    tax_id = Column(Integer)
    GeneID = Column(String(20), primary_key=True)
    Symbol = Column(Text)
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
        GeneID=''.join(oneline[1]),
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


class Interaction(Base):
    __tablename__ = 'interactions'

    id = Column(Integer, primary_key=True, autoincrement=True)
    tax_id1 = Column(Integer)
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
