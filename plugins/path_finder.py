#!/usr/bin/env/python3
# encoding=utf-8
from queue import Queue, PriorityQueue
from datetime import *
from database import DBSession
from models import Node, Link

inf = 10000
Graph = []
dis = []
node_pool = {}
search_pool = {}
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
    dis = [inf for i in range(n)]
    visited = [False for i in range(n)]
    queue = Queue()

    dis[dst] = 0
    visited[dst] = True
    queue.put(dst)
    while not queue.empty():
        u = queue.get()
        # visited[u] = False
        for v in Graph[u]:
            if not visited[v] and dis[v] > dis[u] + 1:
                dis[v] = dis[u] + 1
                if dis[v] < maxlen:
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
    session = DBSession()
    global node_pool, search_pool, node_count, Graph

    # construct the graph
    for node in session.query(Node).all():
        node_pool[
            node.node_id] = node_count  # match node_id of string type to int type, for the convenience of path finding
        search_pool[node_count] = node.node_id  # match int to node_id, it is needed when returning results
        node_count += 1
        Graph.append([])  # Graph[v] is a list containing the adjacent vertexes of v
    for link in session.query(Link).all():
        u = node_pool[link.node_a_id]
        v = node_pool[link.node_b_id]
        if v not in Graph[u]:
            Graph[u].append(v)  # add link.node_b_id as a adjvex of node_a_id
        if u not in Graph[v]:
            Graph[v].append(u)  # and vice versa


# Graph[node_pool[link.node_a_id]].append(node_pool[link.node_b_id])
#        Graph[node_pool[link.node_b_id]].append(node_pool[link.node_a_id])


<<<<<<< HEAD
def path_finder(s, t, k, maxlen, rebuild=False):    # s:starting point, t:terminal point, k:number of paths required
    time_list = {}
    if rebuild:    # if it is needed to rebuild the Graph
=======
def path_finder(s, t, k, rebuild=False):  # s:starting point, t:terminal point, k:number of paths required
    time_list = {}
    time_list['start_time'] = datetime.now()
    if rebuild:  # if it is needed to rebuild the Graph
>>>>>>> origin/zyx
        reload()
        time_list['reload_time'] = datetime.now()
    s = node_pool[s]
    t = node_pool[t]
    time_list['start_time'] = datetime.now()
    calcu_dis(t, node_count, maxlen)
    time_list['calcudis_time'] = datetime.now()
    path_list = []  # contain the found paths
    for p in a_star(s, t, k):
        if p == "None" or p == "Timeout":
            break
        else:
            path = []
            for node in p:
                path.append(search_pool[node])
            path_list.append(path)
    time_list['a*time'] = datetime.now()
    print(time_list)
    return path_list


reload()

'''
Graph = [[1, 2], [0, 4], [0, 5], [4], [3, 5], [2, 4]]
calcu_dis(5, 6)
for p in a_star(1, 5, 2):
    print(p)
'''

# print(path_finder("ECK120011235", "ECK120000311", 5, 5, False))