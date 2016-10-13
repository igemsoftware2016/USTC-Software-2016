"""This is an ABACUS plugin.
    request = {
    "action": "design" or "singleMutationScan"
    "id": user_id
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
from os import mkdir
from plugin import Plugin

from .callabacus import InternalError, FileFormatError

abacuspath = 'plugins/ABACUS/ABACUS/bin/'
designpath = 'plugins/ABACUS/design.py'
mutationpath = 'plugins/ABACUS/singleMutationScan.py'


class ABACUS(Plugin):
    name = 'ABACUS'

    def process(self, request):
        print("ABACUS plugin got a request:" + str(request))

        filepath = abacuspath + 'pdbs/' + request['id'] + '/'
        mkdir(filepath)
        request['file'].save(filepath + request['id'] + '.pdb')

        if request["action"] == "design":
            try:
                tag = request["tag"]
            except KeyError:
                Popen(['python3', designpath, filepath, request['id'] + '.pdb',
                        request['amount'], abacuspath])
            else:
                Popen(['python3', designpath, filepath, request['id'] + '.pdb',
                       request['amount'], abacuspath, request['tag']])
            return {"status": "running"}

        elif request["action"] == "singleMutationScan":

            try:
                size = request["size"]
            except KeyError:
                Popen(['python3', mutationpath, filepath, request['id'] + '.pdb',
                    filepath + 'output.txt', abacuspath])

            else:
                Popen(['python3', mutationpath, filepath, request['id'] + '.pdb',
                       filepath + 'output.txt', abacuspath, size])
            return {"status": "running"}

        else:
            return {"success": False, "reason": "unknown action: " + request["action"]}


__plugin__ = ABACUS()
