from subprocess import Popen
from callabacus import ABACUS_design, ABACUS_prepare, ABACUS_S1S2, ABACUS_singleMutationScan, ABACUS_vdwEtable
from callabacus import InternalError, FileFormatError
import sys
from os import chdir

def singleMutationScan(path, file, abacuspath, output, size=None):
    try:
        chdir(abacuspath)
        f = open(path + 'status.log', 'a')
    except:
        return -1;

    if size is not None:
        try:
            size = int(size)
        except ValueError:
            f.write("[Error]Invalid value\n")
            f.close()
            return -2

    try:
        f.write("[Info]Preparing\n")
        f.close()
        ABACUS_prepare(path, file, abacuspath)
        f = open(path + 'status.log', 'a')
        f.write("[Info]Prepared\n")

        f.write("[Info]Processing...\n")
        f.close()
        ABACUS_S1S2(path, file, abacuspath)
        f = open(path + 'status.log', 'a')
        f.write("[Info]Processed...\n")

        f.write("[Info]Single mutation scaning\n")
        f.close()
        if size is None:
            ABACUS_design(path, file, abacuspath, output)
        else:
            ABACUS_design(path, file, abacuspath, output, size)
            f = open(path + 'status.log', 'a')
        f.write("[Info]Done!\n")


    except InternalError:
        f.write("[Error]Some internal error occured, we are sorry\n")
    except FileFormatError:
        f.write("[Error]File format error!\n")

    f.close()
    return "0"

if __name__ == '__main__':
    if len(sys.argv) == 5:
        singleMutationScan(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])
    elif len(sys.argv) == 6:
        singleMutationScan(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5])
    else:
        print("Parameter error\n")