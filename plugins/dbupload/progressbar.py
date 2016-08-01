import sys


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