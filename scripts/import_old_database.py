#!/usr/bin/env python3
# encoding: utf-8

from pymongo import MongoClient
import json
from bson.json_util import dumps

DATABASE = 'igemdata_new'

tables = ['boost_store', 'count', 'link', 'link_pool', 'link_ref', 'node', 'node_pool', 'node_ref']

client = MongoClient('mongodb://localhost/igemdata_new')
db = client[DATABASE]
data = {}


def fuck(d):
    if isinstance(d, list):
        if len(d) > 0 and isinstance(d[0], dict) and "_id" in d[0]:
            return {str(x['_id']): fuck(x) for x in d}
        else:
            return [fuck(x) for x in d]
    elif isinstance(d, dict):
        return {k: fuck(v) for k, v in d.items()}
    elif type(d).__name__ == 'ObjectId':
        return str(d)
    else:
        return d


for t in tables:
    data[t] = fuck(list(db[t].find()))

print(json.dumps(data))
