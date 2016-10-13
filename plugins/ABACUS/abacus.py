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
from os import mkdir, listdir, getcwd, chdir, path
import os
from shutil import rmtree
from plugin import Plugin
from zipfile import ZipFile, ZIP_DEFLATED
import re

from .callabacus import InternalError, FileFormatError

abacuspath = 'plugins/ABACUS/ABACUS/bin/'
designpath = 'plugins/ABACUS/design.py'
mutationpath = 'plugins/ABACUS/singleMutationScan.py'


class ABACUS(Plugin):
    name = 'ABACUS'

    def process(self, request):
        print("ABACUS plugin got a request:" + str(request))

        filepath = abacuspath + 'pdbs/' + str(self.user.id) + '/'

        print('Gonna save file')
        if not request['action'] == 'getstatus':
            try:
                rmtree(filepath)  # Alert! Clean directory even it is existed
            except:
                pass
            mkdir(filepath)
            request['file'].save(filepath + str(self.user.id) + '.pdb')
            print("File saved")

        if request["action"] == "design":
            try:
                tag = request["tag"]
            except KeyError:
                Popen(['python3', designpath, filepath, str(self.user.id) + '.pdb',
                        request['amount'], abacuspath, request['demo']])
            else:
                Popen(['python3', designpath, filepath, str(self.user.id) + '.pdb',
                       request['amount'], abacuspath, tag, request['demo']])
            return {"status": "running"}

        elif request["action"] == "singleMutationScan":

            try:
                size = request["size"]
            except KeyError:
                Popen(['python3', mutationpath, filepath, str(self.user.id) + '.pdb',
                    filepath + 'output.txt', abacuspath, request['demo']])

            else:
                Popen(['python3', mutationpath, filepath, str(self.user.id) + '.pdb',
                       filepath + 'output.txt', abacuspath, size, request['demo']])
            return {"status": "running"}
        elif request["action"] == 'getstatus':
            f = open(filepath + 'status.log', 'r')
            flag = False
            while 1:
                log = f.read(9600)
                if log.find('Done') != -1:
                    flag = True
                    break
                if not log:
                    break
            # Compress file
            if flag:
                cur_path = getcwd()
                if path.exists('app/static/downloads') and path.isdir('/app/static/downloads'):
                    mkdir('/app/static/downloads')

                target = ZipFile('app/static/downloads/' + str(self.user.id) + '.zip', 'w')
                allfile = listdir(filepath)
                chdir(filepath)
                for file in allfile:
                    if re.match(r'.*_design_.*\.pdb', file) or re.match(r'.*_design_.*\.fasta', file):
                        target.write(file)
                target.close()
                chdir(cur_path)
                return dict(url='/static/downloads/' + str(self.user.id) + '.zip')
            else:
                return dict(status='Running')
        else:
            return {"success": False, "reason": "unknown action: " + request["action"]}


__plugin__ = ABACUS()
