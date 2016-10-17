from queue import PriorityQueue, Queue
from datetime import *
import json
from plugin import Plugin


def MakeArray(n):
    return [0 for i in range(n + 1)]


# class state is aimed at A*-state
class state:
    def __init__(self, f, g, now, pre):
        self.f = f
        self.g = g
        self.now = now
        self.pre = pre

    def __lt__(self, x):
        if (x.f == self.f):
            return x.g > self.g
        return x.f > self.f


q = Queue()
pq = PriorityQueue()
inf = 100000000

edge = []
edge2 = []
next = []
next2 = []

ww = []
point = []
point2 = []
pre = []
dis = []

data = {}


def AddEdge(u, v, w, ee):
    global edge, edge2, ww, next, next2, point, point2
    edge[ee] = v
    edge2[ee] = u
    ww[ee] = w
    next[ee] = point[u]
    point[u] = ee
    next2[ee] = point2[v]
    point2[v] = ee


def Relax(u, v, c):
    global dis
    if dis[v] > dis[u] + c:
        dis[v] = dis[u] + c
        return True
    return False


def SPFA(src, n):
    global dis, point2, next2, ww, inf
    global q

    vis = [False for i in range(n + 1)]
    dis[src] = 0
    q.put(src)
    while not q.empty():
        u = q.get()
        vis[u] = False
        i = point2[u]
        while i != 0:
            v = edge2[i]
            if Relax(u, v, ww[i]) and not vis[v]:
                q.put(v)
                vis[v] = True
            i = next2[i]


def Astar(src, to, k):
    global dis
    global pq

    cnt = 0
    if src == to:
        k += 1
    if dis[src] == inf:
        yield -1
        return
    pq.put(state(dis[src], 0, src, [src]))
    time_monitor = datetime.now()
    while not pq.empty():
        b = pq.qsize()
        a = pq.get()
        if a.now == to:
            yield a.pre
            cnt += 1
            if cnt == k:
                break
        i = point[a.now]
        while i != 0:

            if not edge[i] in a.pre:
                pq.put(state(a.g + ww[i] + dis[edge[i]], a.g + ww[i], edge[i], a.pre + [edge[i]]))
            i = next[i]

            if (datetime.now() - time_monitor).seconds > 5:
                yield 0
                return


def a_star(s_id, t_id, k):
    global edge, edge2, next, next2, ww, point, point2, dis, q, pq

    q = Queue()
    pq = PriorityQueue()
    node_pool = {}
    link_pool = []
    search_pool = {}
    time_point = {}
    start_time = datetime.now()

    information = data['boost_store'][list(data['boost_store'])[0]]
    database_saving = datetime.now()
    time_point["database_saving"] = database_saving - start_time
    node_count = information["node_count"]
    link_count = information["link_count"]
    for id, node in data['node_pool'].items():
        node_pool[node["node_id"]] = node["node_count"]
        search_pool[node["node_count"]] = node["node_id"]
    for id, link in data['link_pool'].items():
        link_pool.append((link["id1"], link["id2"]))

    n_count_time = datetime.now()
    time_point["database reading"] = n_count_time - database_saving

    # initial vars
    edge = MakeArray(link_count * 2 + 1)
    edge2 = MakeArray(link_count * 2 + 1)
    next = MakeArray(link_count * 2 + 1)
    next2 = MakeArray(link_count * 2 + 1)
    ww = MakeArray(link_count * 2 + 1)
    point = MakeArray(node_count)
    point2 = MakeArray(node_count)
    dis = [inf for i in range(node_count + 1)]

    initial_time = datetime.now()
    time_point["initial"] = initial_time - n_count_time

    # add in edge
    link_count = 0
    for link in link_pool:
        id1 = link[0]
        id2 = link[1]
        # ObjectId to int
        link_count += 1
        num_id1 = node_pool[id1]
        num_id2 = node_pool[id2]
        AddEdge(num_id1, num_id2, 1, link_count)
        link_count += 1
        AddEdge(num_id2, num_id1, 1, link_count)
    if not s_id in node_pool or not t_id in node_pool:
        return {'success': False, 'reason': 'Node not found in database!'}

    s = node_pool[s_id]
    t = node_pool[t_id]

    convert_time = datetime.now()
    time_point["convert"] = convert_time - initial_time

    SPFA(t, node_count)

    SPFA_time = datetime.now()
    time_point["SPFA"] = SPFA_time - convert_time

    path_list = []
    for j in Astar(s, t, k):
        # not founded
        if j == -1:
            break

        # overtime
        if j == 0:
            break

        path = []
        for node in j:
            result = {"id": search_pool[node]}
            object_node = data['node'][result["id"]]
            result["NAME"] = object_node["NAME"]
            result["TYPE"] = object_node["TYPE"]
            path.append(result)
            del result
        # path.append(db.node.find_one({"_id": search_dict[node]})["NAME"])
        path_list.append(path)

    Astar_time = datetime.now()
    time_point["Astar"] = Astar_time - SPFA_time
    return {'paths': path_list}


class Path_Finder_New(Plugin):
    def __init__(self):
        super().__init__()
        self.name = 'path_finder_new'
        print('Loading json... Please wait...')
        with open('plugins/igemdata.json') as f:
            global data
            data = json.load(f)

    def process(self, request):
        print(request)
        if request['action'] == 'path_finder':
            return a_star(request['s'], request['t'], int(request['k']))
        else:
            return {'success': False, 'reason': 'unknown action: ' + request['action']}

    def unload(self):
        pass


__plugin__ = Path_Finder_New()
