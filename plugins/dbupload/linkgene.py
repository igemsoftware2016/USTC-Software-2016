from Bio import Entrez as ez
from sqlalchemy.exc import IntegrityError, InvalidRequestError
from database import *
from progressbar import *
from dbprofile import *
import time


def get_bsid(tax_name, log=False, flog=None):
    handle = ez.esearch(db='biosystems', term=tax_name, rettype='count')
    res = ez.read(handle)
    try:
        r_max = int(res['Count'])
    except ValueError as e:
        print(e)

    if r_max <= 0 and log:
        flog.write(tax_name + "bsid not found!\n")
        return None

    handle = ez.esearch(db='biosystems', term=tax_name, retmax=r_max)
    res = ez.read(handle)
    res = res['IdList']
    return res


def get_taxid(tax_name, log=False, flog=False):
    handle = ez.esearch(db='taxonomy', term=tax_name, rettype='count')
    res = ez.read(handle)
    try:
        r_max = int(res['Count'])
    except ValueError as e:
        print(e)

    if r_max <= 0 and log:
        flog.write(tax_name + 'tax_id not found')
        return None

    handle = ez.esearch(db='taxonomy', term=tax_name, retmax=r_max)
    res = ez.read(handle)
    res = res['IdList']

    return res


def set_link(path, echo=False, log=False):
    ez.email = 'biohub@biohub.tech'
    l = 0

    if echo:
        total = count_lines(path)
        if total <= 0:
            echo = False

    if log:
        try:
            flog = open(r'linkgene_log.dat', 'w')
        except IOError as e:
            print(e, 'can\'t log!')
            log = False
        else:
            flog.write('Log date:' + time.asctime(time.localtime(time.time())) + ' Start.\nFile:' + path + '\n')

    # Open file
    try:
        f = open(path, 'r')
    except IOError as e:
        print(e)
        return -10
    except FileNotFoundError as e:
        print(e)
        return -11

    tax_list = []
    while 1:
        temp = f.readline()
        if not temp:
            break

        if temp.startswith('#'):
            continue

        temp = temp.split('\n')
        if temp[0] == '':
            continue
        tax_list.append(temp[0])

    f.close()

    if echo:
        i = 0

    for tax in tax_list:
        # Obtain tax_id from tax name
        if log:
            bsid_list = get_bsid(tax, log, flog)
            taxid_list = get_taxid(tax, log, flog)
        else:
            bsid_list = get_bsid(tax)
            taxid_list = get_taxid(tax)

        if echo:
            i += 1

        # Fail to fetch bsid or tax_id
        if not bsid_list or not taxid_list:
            if log:
                flog.write(time.asctime(time.localtime(time.time())) + ': Cannot find ' + tax + '\'s tax_id or bsid.\n')
            continue

        j = 0
        for bsid in bsid_list:
            j += 1

            # Set command
            cmd ='''select a.gene_id, b.gene_id
                    from biosystems a, biosystems b
                    where a.bsid = '%s'
                    and a.gene_id in(
	                select gene_id
                    from allgeneinfo
                    where tax_id = '%s'
                    )
                    and b.gene_id in (
	                select gene_id
	                from allgeneinfo
	                where tax_id = '%s'
                    )
                    and a.bsid = b.bsid
                    and a.gene_id > b.gene_id;''' % (bsid, taxid_list[0], taxid_list[0])

            # Send command to sql server
            with engine.connect() as con:
                res = con.execute(cmd)
            res = list(res)

            # Result is empty
            if len(res) == 0:
                if log:
                    flog.write(time.asctime(time.localtime(time.time())) + ':' + taxid_list[0] + ':' + bsid + ', not exist!\n')
                continue

            # Insert result to server
            try:
                link_commit(engine.execute, res, taxid_list[0])
            except ValueError as e:
                print(e)
                if log:
                    flog.write(time.asctime(time.localtime(time.time())) + ':' + str(e) + '\n')
                    flog.close()
                return -3
            except IntegrityError as e:
                print(e.orig.args)
                if log:
                    flog.write(time.asctime(time.localtime(time.time())) + ':' + str(e) + '\n')
                    flog.close()
                return -4
            except InvalidRequestError as e:
                print(e)
                if log:
                    flog.write(time.asctime(time.localtime(time.time())) + ':' + str(e) + '\n')
                    flog.close()
                return -5

            if echo:
                l = print_2bar(i, total, j, len(bsid_list), tax, l, bsid)

        if log:
            flog.write(time.asctime(time.localtime(time.time())) + ':' + tax + '(' + tax_list[0] + ')' + ' Done.\n')

    if echo:
        print_2bar(100, 100, 100, 100, '--Done--', l, '------')

    if log:
        flog.close()