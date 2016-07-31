import urllib.parse
import urllib.request

import re

from bs4 import BeautifulSoup


keyword=input("keywords is?\n")
print(keyword)

url='https://scholar.google.com/scholar?&hl=en&q='+keyword+'&btnG=&lr='
header_dict={'Host': 'scholar.google.com',
             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:47.0) Gecko/20100101 Firefox/47.0',
             'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
             'Accept-Language': 'zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3',
             'Referer': 'https://scholar.google.com/schhp?hl=zh-CN',
             'Connection': 'keep-alive'}
req = urllib.request.Request(url=url,headers=header_dict)            
response = urllib.request.urlopen(req,timeout=120)


soup = BeautifulSoup(response)


i = 0
#print(soup.body)
for m in soup.find_all(id='gs_res_bdy'):
    i=i+1
   #print(m)

for n in m.find_all(id='gs_ccl'):
    i=i+1
   #print(n)

i=0    

for k in n.find_all(class_='gs_r'):
    i=i+1
    for l in k.find_all(class_='gs_ri'):
        for r in l.find_all(class_='gs_rt'):
            try:
                print(r.a.get('href'))
            except:
                ii=0
            try:
                print(r.a.text)
            except:
                ii=0
        for r in l.find_all(class_='gs_a'):
            try:
                print(r.text)
            except:
                print('none')
        for r in l.find_all(class_='gs_rs'):
            try:
                print(r.text)
            except:
                ii=0
        for r in l.find_all(class_='gs_fl'):
            try:
                print(r.a.text)
            except:
                ii=0



start=0
start+=10

    
url='https://scholar.google.com/scholar?start='+str(start)+'&hl=en&q='+keyword+'234&btnG=&lr='
req = urllib.request.Request(url=url,headers=header_dict)            
response = urllib.request.urlopen(req,timeout=120)


soup = BeautifulSoup(response)


i = 0
#print(soup.body)
for m in soup.find_all(id='gs_res_bdy'):
    i=i+1
   #print(m)

for n in m.find_all(id='gs_ccl'):
    i=i+1
   #print(n)

i=0    

for k in n.find_all(class_='gs_r'):
    i=i+1
    for l in k.find_all(class_='gs_ri'):
        for r in l.find_all(class_='gs_rt'):
            try:
                print(r.a.get('href'))
            except:
                ii=0
            try:
                print(r.a.text)
            except:
                ii=0
        for r in l.find_all(class_='gs_a'):
            try:
                print(r.text)
            except:
                print('none')
        for r in l.find_all(class_='gs_rs'):
            try:
                print(r.text)
            except:
                ii=0
        for r in l.find_all(class_='gs_fl'):
            try:
                print(r.a.text)
            except:
                ii=0

