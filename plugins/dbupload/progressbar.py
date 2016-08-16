import sys
from time import *


def count_lines(path):
    try:
        fp = open(path, 'r')
    except IOError as e:
        print(e)
        return -1

    count = 0

    while 1:
        try:
            buffer = fp.read(4*1024*1024)
        except UnicodeDecodeError as e:
            print(e)
            continue

        if not buffer:
            break

        count += buffer.count('\n')
    fp.close()

    return count


def print_bar(num, lines_num):
    printnum = int(100 * num / lines_num)
    ratio = int(100 * num / lines_num)
    strs = ''
    for i in range(0, printnum):
        strs += '#'
    for i in range(printnum, 100):
        strs += ' '

    sys.stdout.write('\r' + str(ratio) + '% [' + strs + ']')
    sys.stdout.flush()


def print_2bar(num1, total1, num2, total2, name, size, bsid):
    ratio1 = int(100 * num1 / total1)
    ratio2 = int(100 * num2 / total2)

    strs1 = ''
    strs2 = ''

    for i in range(0, int(ratio1 / 2)):
        strs1 += '#'
    for i in range(int(ratio1 / 2), 50):
        strs1 += ' '

    for i in range(0, int(ratio2 / 2)):
        strs2 += '#'
    for i in range(int(ratio2 / 2), 50):
        strs2 += ' '

    str_end = str(ratio1) + '% [' + strs1 + ']' + '  ' + str(ratio2) + '% [' + strs2 + ']' + '  tax name:' + name + ' | bsid:' + bsid
    length = len(str_end)

    if length < size:
        for i in range(0, size - length):
            str_end += ' '

    sys.stdout.write('\r' + str_end)
    sys.stdout.flush()

    return length
