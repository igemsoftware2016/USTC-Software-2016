from sqlalchemy.exc import IntegrityError, InvalidRequestError
from database import *
from progressbar import *
import time


class DataBaseSourceError(Exception):
    pass


class EOF(Exception):
    pass


# Return -1: File not found
# Return -2: primary key duplicated


def init_sqlalchemy():
    # DBSession.remove()
    DBSession.configure(bind=engine, autoflush=False, expire_on_commit=False)
    TableBase.metadata.drop_all(engine)
    TableBase.metadata.create_all(engine)


# Set echo to True to enable progress bar.
def upload(path, commit, column_num, cache_size=100000, echo=False, log=False):
    # Open file
    if echo:
        line_num = count_lines(path)
    if log:
        try:
            logf = open('log.dat', 'w+')
        except IOError as e:
            print(e, 'can\'t log!')
            log = False
        else:
            logf.write('Log date:' + time.asctime(time.localtime(time.time())) + ' Start.\nFile:' + path + '\n')

    try:
        f = open(path, 'r')
    except IOError as e:
        print(e)
        if log:
            logf.write(time.asctime(time.localtime(time.time())) + ':' + e)
            logf.close()
        return -1
    except FileNotFoundError as e:
        print(e)
        if log:
            logf.write(time.asctime(time.localtime(time.time())) + ':' + e)
            logf.close()
        return -2

    # Initialize
    init_sqlalchemy()

    num = 0

    flag = False
    while 1:
        res = []
        # cache_size is import for a high speed upload
        for i in range(1, cache_size + 1):
            num += 1
            try:
                line = f.readline()
            except UnicodeDecodeError as e:
                print("In " + path + " row ", num + i, '.', end='')
                print(e)
                if log:
                    logf.write(time.asctime(time.localtime(time.time())) + ':' + "In " + path + " row " +
                               str(num + i) + '.' + str(e) + '\n')
                continue
            else:
                if not line:
                    flag = True
                    break

            # Filter and append
            if line.startswith('#'):
                continue
            if line == '':
                continue
            temp = line.split('\t')
            if len(temp) != column_num:
                print("In " + path + " row ", num, ", data missed or duplicated.")
                if log:
                    logf.write(time.asctime(time.localtime(time.time())) + ':' + "In " + path + " row " + str(num)
                            + ", data missed or duplicated." + '\n')
            else:
                res.append(temp)

        # Commit
        try:
            commit(engine.execute, res, num)
            if echo:
                print_bar(num, line_num)

        except ValueError as e:
            print(e)
            if log:
                logf.write(time.asctime(time.localtime(time.time())) + ':' + str(e) + '\n')
                logf.close()
            return -3
        except IntegrityError as e:
            print(e.orig.args)
            if log:
                logf.write(time.asctime(time.localtime(time.time())) + ':' + str(e) + '\n')
                logf.close()
            return -4
        except InvalidRequestError as e:
            print(e)
            if log:
                logf.write(time.asctime(time.localtime(time.time())) + ':' + str(e) + '\n')
                logf.close()
            return -5

        if flag:
            break

    if log:
        logf.close()
