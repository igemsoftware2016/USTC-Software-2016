from sqlalchemy import Column, Text, create_engine, Integer, Date, String
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from config import database_path
from sqlalchemy.exc import IntegrityError
import re


# Return -1: File not found
# Return -2: primary key duplicated

# Define database file error exception
class DataBaseSourceError(Exception):
    pass


def upload(path, cache_size = 100000):
    # Initialize base
    Base = declarative_base()

    # defien Gene
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

        # Open file

    try:
        f = open(path, 'r')
    except IOError as e:
        print(e)
        return -1

        # set sessions and engine
    engine = create_engine(database_path)

    DBSession = sessionmaker(bind=engine)

    session = DBSession()

    # These two are used to commit data im large number
    num = 0
    guard = num

    while 1:
        res = []

        # cache_size is import for a high speed upload
        lines = f.readlines(cache_size)
        if not lines:
            break

        # Filter and append
        for line in lines:
            if re.match('[\t\' \']*#', line):
                continue
            res.append(line.split('\t'))

        for oneline in res:
            num += 1
            try:
                if len(oneline) != 15:
                    raise DataBaseSourceError
            except DataBaseSourceError:
                print("In " + path + " row ", num, ", data missed or duplicated.")
                continue

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

            session.add(new_gene)

            if (num - guard >= cache_size):
                guard = num
                try:
                    session.commit()
                except IntegrityError as e:
                    print(e.orig.args)
                    return -2

        if (guard != num):
            try:
                session.commit()
            except IntegrityError as e:
                print(e.orig.args)

    session.close()