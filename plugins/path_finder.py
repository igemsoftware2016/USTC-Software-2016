#!/usr/bin/env/python3
# encoding=utf-8
from queue import Queue, PriorityQueue
from datetime import *
from database import session
from models import Node, Link
from plugin import Plugin

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


def reload():  # reload data from database
    global node_count, Graph

    # construct the graph
    for node in session.query(Node).all():
        Graph[node.node_id] = []  # Graph[v] is a list containing the adjacent vertexes of v
    for link in session.query(Link).all():
        if link.node_b_id not in Graph[link.node_a_id]:
            Graph[link.node_a_id].append(link.node_b_id)  # add link.node_b_id as a adjvex of node_a_id
        if link.node_a_id not in Graph[link.node_b_id]:
            Graph[link.node_b_id].append(link.node_a_id)  # and vice versa


def path_finder(s, t, k, maxlen):  # s:starting point, t:terminal point, k:number of paths required
    calcu_dis(t, node_count, maxlen)
    path_list = []  # contain the found paths
    for p in a_star(s, t, k):
        if p == "None" or p == "Timeout":
            break
        else:
            path_list.append(p)
    return path_list


# print(path_finder("ECK120011235", "ECK120000311", 5, 5))


class Path_Finder(Plugin):
    def __init__(self):
        super().__init__()
        self.name = 'path_finder'
        reload()

    def process(self, request):
        print(request)
        if request['action'] == 'path_finder':
            result = path_finder(request['s'], request['t'], request['k'])
            return {'paths': result}
        if request['action'] == 'reload':
            reload()
            return {}
        else:
            return {'success': False, 'reason': 'unknown action: ' + request['action']}

    def unload(self):
        pass


__plugin__ = Path_Finder()
