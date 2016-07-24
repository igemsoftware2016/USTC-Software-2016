#!/usr/bin/env python3
# encoding=utf-8

from database import Node, Link, DBSession

session = DBSession()

node = session.query(Node).filter(Node.node_name == 'rhsE').first()

print(node.node_id)

links = session.query(Link).filter(Link.node_a_id == node.node_id).all()

for l in links:
    print(l.node_b_id)
