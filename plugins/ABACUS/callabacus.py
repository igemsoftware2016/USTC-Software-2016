from subprocess import Popen


class InternalError(Exception):
    pass


class FileFormatError(Exception):
    pass


def ABACUS_prepare(path, file):
    p = Popen([".\ABACUS_prepare", path+file])
    while p.poll() is None:
        pass
    if p.poll():
        f = open(path+'err.log')
        exp = f.read(1E4)
        if exp.find("no protein chain detected") != -1:
            raise FileFormatError("File format error! No protein chain detected!")
        else:
            raise InternalError("We are sorry, something wrong happened")

    return p.poll()


def ABACUS_S1S2(path, file):
    p = Popen([".\ABACUS_S1S2", path+file])
    while p.poll() is None:
        pass
    if p.poll():
        raise InternalError("We are sorry, something wrong happened")

    return p.poll()


def ABACUS_vdwEtable(path, file):
    p = Popen([".\ABACUS_vdwEtable", path+file])
    while p.poll() is None:
        pass
    if p.poll():
        raise InternalError("We are sorry, something wrong happened")

    return p.poll()


def ABACUS_design(path, file, num):
    p = Popen([".\ABACUS_design", path+file, num])
    while p.poll() is None:
        pass
    if p.poll():
        raise InternalError("We are sorry, something wrong happened")

    return p.poll()


def ABACUS_suspiciousSites(path, file, output):
    p = Popen([".\ABACUS_suspiciousSites", path+file, output])
    while p.poll() is None:
        pass
    if p.poll():
        raise InternalError("We are sorry, something wrong happened")

    return p.poll()


def ABACUS_singleMutationScan(path, file, output, size=None):
    if size is None:
        p = Popen([".\ABACUS_singleMutationScan", path+file, output])
    else:
        p = Popen([".\ABACUS_singleMutationScan", path + file, output, size])

    while p.poll() is None:
        pass
    if p.poll():
        raise InternalError("We are sorry, something wrong happened")

    return p.poll()
