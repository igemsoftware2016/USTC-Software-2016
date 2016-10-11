"""This is an ABACUS plugin.
    request = {
    "action": "design" or "singleMutationScan"
    "id": fileID
    "inpath": inputFilePath
    "filename": filename
    "amount": amount #optional
    "tag":tag
    "design": desginpath
    "mutationScan": scanpath
    "abacuspath": path
    }
"""
from time import ctime
from subprocess import Popen
from os import execvp
from plugin import Plugin

from .callabacus import InternalError, FileFormatError


class ABACUS(Plugin):
    name = 'BLAST'

    def process(self, request):
        print("example plugin got a request:" + str(request))
        if request["action"] == "design":
            try:
                tag = request["tag"]
            except KeyError:
                execvp('python3',
                       ['python3', request['design'], request["inpath"], request['filename'],
                        request['amount'], request['abacuspath']])
            else:
                execvp('python3',
                       ['python3', request['design'], request["inpath"], request['filename'],
                        request['amount'], request['abacuspath'], request['tag']])
            return {"status": "running"}

        elif request["action"] == "singleMutationScan":

            try:
                size = request["size"]
            except KeyError:
                execvp(execvp('python3',
                   ['python3', request['mutationScan'], request["inpath"], request['filename'],
                    request['output'], request['abacuspath']]))

            else:
                execvp(execvp('python3',
                              ['python3', request['mutationScan'], request["inpath"], request['filename'],
                               request['output'], request['abacuspath'], size]))
            return {"status": "running"}

        else:
            return {"success": False, "reason": "unknown action: " + request["action"]}


__plugin__ = ABACUS()
