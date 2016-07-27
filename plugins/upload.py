from sqlalchemy import Column, Text, create_engine, Date, String, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker
from config import database_path
import re
from sqlalchemy.exc import IntegrityError


class SQLalchemyEngineInitError(Exception):
    pass


class DataBaseSourceError(Exception):
    pass


def getattrs(path):
    res = []

    f = open(path, 'r')
    cache_size = 1000000
    while 1:
        lines = f.readlines(cache_size)
        if not lines:
            break

        for line in lines:
            if re.match('[\t\' \']*#', line):
               continue

            res.append(line.split('\t'))

    return res


def init_sqlalchemy(dbname=database_path):
    global engine
    Base = declarative_base()
    DBSession = scoped_session(sessionmaker())

    engine = create_engine(dbname, echo=False)
    DBSession.remove()
    DBSession.configure(bind=engine, autoflush=False, expire_on_commit=False)
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
    if not engine:
        raise SQLalchemyEngineInitError
    else:
        return engine


def upload(path):
    try:
        res = getattrs(path)
    except IOError as e:
        print(e)
        return -1

    Base = declarative_base()
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




    try:
        engine = init_sqlalchemy()
    except SQLalchemyEngineInitError:
        print("Engine failed to initialize. Exiting...")
        return -2



    num = 0
    for oneline in res:
        num += 1
        try:
            if len(oneline) != 15:
                raise DataBaseSourceError()
        except DataBaseSourceError:
            print("In " + path + " row ", num, ", data missed or duplicated.")
            continue

        day = ''.join(oneline[14])

        day = day[0:4] + '-' + day[4:6] + '-' + day[6:8]

        try:
            engine.execute(
                Gene.__table__.insert(),
                {'tax_id': ''.join(oneline[0]),
                 'GeneID': ''.join(oneline[1]),
                 'Symbol': ''.join(oneline[2]),
                 'LocusTag': ''.join(oneline[3]),
                 'Synonyms': ''.join(oneline[4]),
                 'dbXrefs': ''.join(oneline[5]),
                 'chromosome': ''.join(oneline[6]),
                 'map_location': ''.join(oneline[7]),
                 'description': ''.join(oneline[8]),
                 'type_of_gene': ''.join(oneline[9]),
                 'Symbol_from_nomenclature_authority': ''.join(oneline[10]),
                 'Full_name_from_nomenclature_authority': ''.join(oneline[11]),
                 'Nomenclature_status': ''.join(oneline[12]),
                 'Other_designations': ''.join(oneline[13]),
                 'Modification_date': day
                 })
        except IntegrityError as e:
            print(e.orig.args, "In " + path + " row ", num, ".")
            continue
