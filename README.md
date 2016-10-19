Welcome to BioHub!
==================
BioHub is a software tool for synthetic biologists developed by USTC-Software. It aims at helping synthetic biologists to deal with data from different types such as regulatory proteins, regulatory elements in gene expression.

BioHub is done using an extensive plug-in system with some handy utility such as pathway-finding, one key blast and quick query. Users can have their own personalized Biohub according to their need.

[Learn more about us](http://2016.igem.org/Team:USTC-Software)

How to install BioHub
---------------------
We suggest users use [Docker](https://www.docker.com/) to deploy BioHub. It just needs two steps:

    docker run -d --name biohubdb -e MYSQL_ROOT_PASSWORD=password mysql
    docker run -d --name biohub --link biohubdb:db -p 80:5000 biohubtech/biohub

You can also use `-e BIOHUB_DB_HOST=<host>` and/or `-e BIOHUB_DB_USER=<user> -e BIOHUB_DB_PASSWORD=<password>` to connect to other databases.

Also, you can clone the repo and run it manually. We've tested this on Debian 8:

    sudo apt update
    sudo apt install git python3 python3-pip python3-biopython python3-flask python3-sqlalchemy python3-scipy libmysqlclient-dev mysql-server mysql-client wget
    git clone https://github.com/igemsoftware2016/USTC-Software-2016.git
    cd USTC-Software-2016
    sudo pip3 install flask_login mysqlclient
    echo CREATE DATABASE biohub | mysql -u<user> -p # please fill in the blanks
    wget http://parts.igem.org/partsdb/download.cgi?type=parts_sql -O biobricks.sql.gz
    gunzip biobricks.sql.gz
    mysql -u<user> -p biohub < biobricks.sql # please fill in the blanks
    echo "DATABASE_URI = 'mysql://<username>:<password>@localhost/biohub'" >config.py # please fill in the blanks
    echo "SECRET_KEY = '<a random string>'" >>config.py # please fill in the blanks
    ./run.py
    # then the server will start on port 5000
