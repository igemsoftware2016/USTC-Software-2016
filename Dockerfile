FROM biohubtech/biohubbase
MAINTAINER Zibo Wang, USTC, wzb15@mail.ustc.edu.cn
EXPOSE 5000
WORKDIR /root
RUN git clone https://github.com/Smart-Hypercube/USTC-Software-2016.git
WORKDIR /root/USTC-Software-2016
ADD config.docker.py ./config.py
ADD first .
ENTRYPOINT ./run.py
