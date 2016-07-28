from sqlalchemy.exc import IntegrityError, InvalidRequestError
from dbprofile import *
from database import *


# Return -1: File not found
# Return -2: primary key duplicated
class EOF(Exception):
    pass


def upload(path, cache_size=100000):
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
        lines = []
        flag = false
        # cache_size is import for a high speed upload
        for i in range(1, cache_size + 1):
            try:
                line = f.readline()
                if not line:
                    raise EOF
            except UnicodeDecodeError as e:
                print("In " + path + " row ", num + i, '.')
                print(e)
            except EOF:
                break
                flag = false
            # Filter and append
            if line.startswith('#'):
                continue
            res.append(line.split('\t'))

        # Exit condition
        if flag:
            break

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
