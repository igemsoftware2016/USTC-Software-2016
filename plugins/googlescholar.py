#!/usr/bin/env/python3
# encoding=utf-8

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




'''

#print(f.read())
#with open('aaa.html', 'wb') as f:
#    f.write(response.read())

print("conneect succeed!")
'''
'''data=response.read().decode('utf-8')
pattern = re.compile(r'<div class="gs_r"><div class="gs_ri"><h3.*?<a onclick',re.S)

for m in re.finditer(pattern,data):
    print (m.group())
'''
'''
#print(response.read())
data=response.read()

data=data.decode()

pattern = re.compile(r'<div class="gs_ri">.*?</div></div></div>')

#print(data)
# 使用re.match匹配文本，获得匹配结果，无法匹配时将返回None
result1 = re.search(pattern,data)

'''

'''
if result1:
    # 使用Match获得分组信息
    print (result1.group().encode('utf_8'))
else:
    print ('1匹配失败！')
 '''

'''
m=re.findall(pattern,data)
print("data get")
print(len(m))


address = re.compile(r'<a href=".*?"')
author= re.compile(r'<div class="gs_a">.*?</div>')
abstruct=re.compile(r'<div class="gs_rs">.*?</div>')

for s in m:
    net=re.search(address,s)
    temp=net.group()
    print("url:")
    print(temp[9:-1])
    net=re.search(author,s)
    temp=net.group()
    a1 = re.compile(r'<a.*?>')
    print("author:")
    #replacedStr = re.sub("\d+", "222", inputStr)
    temp= re.sub(a1,'',temp)
    print(temp[18:-6])
    net=re.search(abstruct,s)
    if(net):
        print("abstruct:")
        temp=net.group()
        temp=temp.replace("<b>"," ").replace("<br>"," ").replace("</b>"," ")
        print(temp[19:-6])
        
    else:
        print("no abstrutct")
    print('')



'''
