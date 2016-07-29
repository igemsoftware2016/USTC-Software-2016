from sqlalchemy.exc import IntegrityError, InvalidRequestError
from database import *
from progressbar import *


class DataBaseSourceError(Exception):
    pass


class EOF(Exception):
    pass
# Return -1: File not found
# Return -2: primary key duplicated


# Set echo to True to enable progress bar.
def upload(path, init, cache_size=100000, echo=False):
    # Open file
    if echo:
        line_num = count_lines(path)

    try:
        f = open(path, 'r')
    except IOError as e:
        print(e)
        return -1

    session = DBSession()

    # These two are used to commit data im large number
    num = 0
    guard = num

    flag = False
    while 1:
        res = []
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
                flag = true
                break

            # Filter and append
            if line.startswith('#'):
                continue
            res.append(line.split('\t'))

        # Exit condition
        for oneline in res:
            num += 1

            try:
                new_interaction = init(oneline)
            except DataBaseSourceError:
                print("In " + path + " row ", num, ", data missed or duplicated.")
                continue
            except ValueError as e:
                print(e)
                continue

            session.add(new_interaction)

            if num - guard >= cache_size:
                guard = num
                try:
                    if echo:
                        print_bar(num, line_num)

                    session.commit()
                except IntegrityError as e:
                    print(e.orig.args)
                    return -2
                except InvalidRequestError as e:
                    print(e)
                    return -3

        if flag:
            break

# Deal with rows left
    if guard != num:
        try:
            if echo:
                print_bar(line_num, line_num)

            session.commit()
        except IntegrityError as e:
            print(e.orig.args)
        except InvalidRequestError as e:
            print(e)
            return -3

    session.close()
