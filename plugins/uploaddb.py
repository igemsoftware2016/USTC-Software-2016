from sqlalchemy.exc import IntegrityError, InvalidRequestError
import re
from dbprofile import *
from database import *


# Return -1: File not found
# Return -2: primary key duplicated


def upload(path, cache_size = 100000):
        # Open file

    try:
        f = open(path, 'r')
    except IOError as e:
        print(e)
        return -1

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
                new_interaction = interaction_init(oneline)
            except DataBaseSourceError:
                print("In " + path + " row ", num, ", data missed or duplicated.")
                continue

            session.add(new_interaction)

            if num - guard >= cache_size:
                guard = num
                try:
                    session.commit()
                except IntegrityError as e:
                    print(e.orig.args)
                    return -2
                except InvalidRequestError as e:
                    print(e)
                    return -3

        if guard != num:
            try:
                session.commit()
            except IntegrityError as e:
                print(e.orig.args)
            except InvalidRequestError as e:
                print(e)
                return -3
    session.close()