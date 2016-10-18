#!/usr/bin/env/python3
# encoding=utf-8
from queue import Queue, PriorityQueue
from datetime import *
from database import session
# from models import Node, Link
from plugin import Plugin
from .dbupload.dbprofile import biosys_single

inf = 20
Graph = {}
dis = {}
node_count = 0


class State:
    def __init__(self, f, g, cur, prepath):  # f is the distance to src, g is the distance to dst
        self.f = f
        self.g = g
        self.cur = cur
        self.prepath = prepath

    def __lt__(self, x):
        if self.f == x.f:
            return self.g < x.g
        else:
            return self.f < x.f


def calcu_dis(dst, n, maxlen):
    global dis
    visited = {}
    queue = Queue()

    dis[dst] = 0
    visited[dst] = True
    queue.put(dst)
    while not queue.empty():
        u = queue.get()
        # visited[u] = False
        Graph[u] = []
        for u_node in session.query(biosys_single).filter(biosys_single.gene_id == u):
            for node in session.query(biosys_single).filter(biosys_single.bsid == u_node.bsid):
                if node.gene_id not in Graph[u]:
                    Graph[u].append(node.gene_id)
        for v in Graph[u]:
            if (v not in visited or dis[v] > dis[u] + 1) and dis[u] + 1 <= maxlen:
                dis[v] = dis[u] + 1
                visited[v] = True
                queue.put(v)


def a_star(src, dst, pathnum):
    p_queue = PriorityQueue()
    global dis
    cnt = 0

    time_monitor = datetime.now()
    if dis[src] == inf:  # if there's no path from src to dst
        yield "None"
        return
    p_queue.put(State(dis[src], 0, src, [src]))
    while not p_queue.empty():
        s = p_queue.get()
        if s.cur == dst:
            yield s.prepath
            cnt += 1
            if cnt == pathnum:
                break
        for v in Graph[s.cur]:
            if v not in s.prepath:
                p_queue.put(State(s.g + 1 + dis[v], s.g + 1, v, s.prepath + [v]))

        if (datetime.now() - time_monitor).seconds > 5:
            yield "Timeout"
            return


def path_finder(s, t, k, maxlen):  # s:starting point, t:terminal point, k:number of paths required
    calcu_dis(t, node_count, maxlen)
    path_list = []  # contain the found paths
    for p in a_star(s, t, k):
        if p == "None" or p == "Timeout":
            break
        else:
            path_list.append(p)
    return path_list


class Path_Finder(Plugin):
    def __init__(self):
        super().__init__()
        self.name = 'path_finder'
    #    reload()

    def process(self, request):
        print(request)
        if request['action'] == 'path_finder':
            result = path_finder(request['s'], request['t'], int(request['k']), int(request['maxlen']))
            return {'paths': result}
    #    if request['action'] == 'reload':
    #        reload()
    #        return {}
        else:
            return {'success': False, 'reason': 'unknown action: ' + request['action']}

    def unload(self):
        pass


__plugin__ = Path_Finder()
