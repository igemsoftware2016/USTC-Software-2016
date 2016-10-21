from callabacus import ABACUS_design, ABACUS_prepare, ABACUS_S1S2, ABACUS_singleMutationScan, ABACUS_vdwEtable
from callabacus import InternalError, FileFormatError
import sys
from os import chdir, rename
import time


def design(path, file, amount, abacuspath, demo=False, tag=None):
    if demo == 'True':
        demo = True
        fp = open(path + 'err.log', 'w')
        fp.close()
    else:
        demo = False

    try:
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
        if not demo:
            ABACUS_prepare(path, file, abacuspath)
        f = open(path + 'status.log', 'a')
        f.write("[Info]Prepared\n")

        f.write("[Info]Processing...\n")
        f.close()
        if not demo:
            ABACUS_S1S2(path, file, abacuspath)
        f = open(path + 'status.log', 'a')
        f.write("[Info]Processed...\n")

        f.write("[Info]Generating energy table\n")
        f.close()
        if not demo:
            ABACUS_vdwEtable(path, file, abacuspath)
        f = open(path + 'status.log', 'a')
        f.write("[Info]Generate energy table\n")

        f.write("[Info]Designing\n")
        f.close()
        if not demo:
            if tag is None:
                ABACUS_design(path, file, abacuspath, amount)
            else:
                ABACUS_design(path, file, abacuspath, amount, tag)
        else:
            print("I am gonna sleep")
            time.sleep(10)
            fp = open(path + 'demo_design_demo.fasta', 'w')
            fp.close()
            fp = open(path + 'demo_design_demo.pdb', 'w')
            fp.close()

        f = open(path + 'status.log', 'a')
        f.write("[Info]Done!\n")

    except InternalError:
        f.write("[Error]Some internal error occured, we are sorry\n")
    except FileFormatError:
        f.write("[Error]File format error!\n")
    f.close()
    return "0"

if __name__ == '__main__':
    if len(sys.argv) == 6:
        design(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5])
    elif len(sys.argv) == 7:
        design(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5], sys.argv[6])
    else:
        print("Parameter error\n")