FROM biohubtech/biohubbase
MAINTAINER Zibo Wang, USTC, wzb15@mail.ustc.edu.cn
EXPOSE 5000
WORKDIR /root
ADD . .
RUN mv config.docker.py config.py
ENTRYPOINT ./run.py
