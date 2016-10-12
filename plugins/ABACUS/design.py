from callabacus import ABACUS_design, ABACUS_prepare, ABACUS_S1S2, ABACUS_singleMutationScan, ABACUS_vdwEtable
from callabacus import InternalError, FileFormatError
import sys
from os import chdir

def design(path, file, amount, abacuspath, tag=None):
    try:
        chdir(abacuspath)
        f = open(path + 'status.log', 'a')
    except:
        return -1;

    try:
        amount = int(amount)
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

        f.write("[Info]Generating energy table\n")
        f.close()
        ABACUS_vdwEtable(path, file, abacuspath)
        f = open(path + 'status.log', 'a')
        f.write("[Info]Generate energy table\n")

        f.write("[Info]Designing\n")
        f.close()
        if tag is None:
            ABACUS_design(path, file, abacuspath, amount)
        else:
            ABACUS_design(path, file, abacuspath, amount, tag)
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
        design(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])
    elif len(sys.argv) == 6:
        design(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5])
    else:
        print("Parameter error\n")