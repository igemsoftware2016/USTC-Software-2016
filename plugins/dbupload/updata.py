from .dbprofile import *
from .uploaddb import *

if __name__ == '__main__':
    start = time.clock()
    print(upload.upload("\srv\All_Data.gene_info", gene_commit, 15, 500000, echo=True, log=True))

    # set_link(path=r"\srv\All_Data.gene_info", echo=True, log=True)

    print(str(time.clock() - start) + 's used.')