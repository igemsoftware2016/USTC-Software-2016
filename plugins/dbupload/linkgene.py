from sqlalchemy.exc import IntegrityError, InvalidRequestError
from sqlalchemy.exc import ProgrammingError
from database import *
from progressbar import *
from dbprofile import *
import time


def set_link(cmd_base='', cache_size=100, echo=False):
    session = DBSession()
    if cache_size <= 0:
        return -1

    if echo:
        try:
            res = session.execute('select count(*) from (select tax_id from taxonomy group by tax_id) num;')
        except ProgrammingError as e:
            print(e)
            return -3

        res = list(res)[0][0]
        try:
            total = int(res)
        except ValueError as e:
            print(e)
            return -2

    try:
        tax_list = session.execute('select tax_id from taxonomy group by tax_id')
        # tax_list = list(tax_list)
    except ProgrammingError as e:
        print(e)

    if echo:
        i = 0

    for tax in tax_list:
        tax_id = tax[0]
        cmd = 'select a.bsid, a.gene_id, b.gene_ID \
from biosystems a, biosystems b \
where a.bsid in ( \
	select bsid \
    from taxonomy \
    where tax_id =' + tax_id + ')' + 'and a.gene_id in ( \
	select gene_id \
    from allgeneinfo \
    where tax_id = ' + tax_id + ')' + 'and b.gene_id in ( \
	select gene_id \
    from allgeneinfo \
    where tax_id =' + tax_id +')' + 'and a.bsid = b.bsid \
and a.gene_id > b.gene_id;'

        result = session.execute(cmd)
        result = list(result)
        if len(result) == 0:
            if echo:
                i += 1

            print(tax_id)
            continue

        print(tax_id, i, 'Count!')

        link_commit(engine.execute, result, tax_id)

        if echo:
            i += 1
            print_bar(i, total)

    if echo:
        print_bar(100, 100)
