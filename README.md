Welcome to BioHub!
==================
BioHub is a software tool for synthetic biologists developed by USTC-Software. It aims at helping synthetic biologists to deal with data from different types such as regulatory proteins, regulatory elements in gene expression.

BioHub is done using an extensive plug-in system with some handy utility such as pathway-finding, one key blast and quick query. Users can have their own personalized Biohub according to their need.

[Learn more about us](http://2016.igem.org/Team:USTC-Software)

**If you just want to try it, please visit our example website [biohub.tech](http://biohub.tech/).**

We strongly recommend you to use **Chrome** web browser, since other browsers are not fully supported.

How to install BioHub on your lab server
----------------------------------------
We suggest users use [Docker](https://www.docker.com/) to deploy BioHub. It just needs two steps:

    docker run -d --name biohubdb -e MYSQL_ROOT_PASSWORD=password mysql
    docker run -d --name biohub --link biohubdb:db -p 80:5000 biohubtech/biohub

You can also use `-e BIOHUB_DB_HOST=<host>` and/or `-e BIOHUB_DB_USER=<user> -e BIOHUB_DB_PASSWORD=<password>` to connect to other databases.

Also, you can clone the repo and run it manually. We've tested this on Debian 8:

    sudo apt update
    sudo apt install git python3 python3-pip python3-biopython python3-flask python3-sqlalchemy python3-scipy libmysqlclient-dev mysql-server mysql-client wget
    git clone https://github.com/igemsoftware2016/USTC-Software-2016.git
    cd USTC-Software-2016
    sudo pip3 install flask_login mysqlclient pymysql
    echo CREATE DATABASE biohub | mysql -u<user> -p # please fill in the blanks
    wget http://parts.igem.org/partsdb/download.cgi?type=parts_sql -O biobricks.sql.gz
    gunzip biobricks.sql.gz
    mysql -u<user> -p biohub < biobricks.sql # please fill in the blanks
    mysql -u<user> -p biohub < ncbi_562.sql
    echo "DATABASE_URI = 'mysql://<username>:<password>@localhost/biohub'" >config.py # please fill in the blanks
    echo "SECRET_KEY = '<a random string>'" >>config.py # please fill in the blanks
    ./run.py
    # then the server will start on port 5000

After the installation, only one of the species databases is imported for demo. You can download databases from NCBI and import them manually by our script.

How to install ABACUS plugin
--------------

Copy and run the code below to install ABACUS:

We assume that USTC-Software-2016 is the path to our git repo.

    wget http://download.biohub.tech/ABACUS.tar.gz
    wget http://download.biohub.tech/ABACUS.db.tar.gz
    tar -xvzf ABACUS.tar.gz
    tar -xvzf ABACUS.db.tar.gz
    mv ABACUS $BioHubPath/USTC-Software-2016/plugins/ABACUS/
    # $BioHubPath is the path you install BioHub
    cd $BioHubPath/USTC-Software-2016/plugins/ABACUS/ABACUS/
    sh setup.sh
    # You will get a message like set ABACUSPATH=$BioHubPath/USTC-Software-2016/plugins/ABACUS/ABACUS
    export ABACUSPATH=$BioHubPath/USTC-Software-2016/plugins/ABACUS/ABACUS/
    # Don’t forget the last slash
    cd bin
    mkdir pdbs
    # If you are on Intel platform, please do the following steps
    rm psdSTRIDE
    wget http://download.biohub.tech/psdSTRIDE
    # All done!

Upload Data File From NCBI
--------------------------

Goto root direction, open ncbiuploader.py. Change filepath to the path you store NCBI data file, and change column_num to the number of columns in data file.

It’s recommended to download file from following url:

    ftp://ftp.ncbi.nlm.nih.gov/gene/DATA/GENE_INFO/All_Data.gene_info.gz, column_num=15.
    ftp://ftp.ncbi.nlm.nih.gov/pub/biosystems/biosystems.20161008/biosystems_gene_all.gz, column_num=3

Add index for tables:

    alter table biosystems add index all_index (gene_id, bsid);
    alter table allgeneinfo_all add index all_index (gene_id, tax_id, Symbol);
    alter table allgeneinfo_all add fulltext('Symbol');

To create database for pathfinder, execute the following SQL statement:

    create table biosys_562 (
    id int primary key AUTO_INCREMENT,
    gene_id char(10),
    tax_id char(10),
    bsid int,
    Symbol char(64));

    alter table biosys_562 add index all_index(gene_id, bsid);

    insert into biosys_562 (gene_id, tax_id, bsid, Symbol)
    select a.gene_id, a.tax_id, b.bsid, a.Symbol
    from allgeneinfo_all a, biosystems b
    where a.gene_id = b.gene_id and a.tax_id='%tax_id%';
