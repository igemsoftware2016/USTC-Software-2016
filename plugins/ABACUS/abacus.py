"""This is an ABACUS plugin.
    request = {
    "action": "design" or "suspiciousSites" or "singleMutationScan"
    "id": fileID
    "inpath": inputFilePath
    "filename": filename
    "amount": amount #optional
    }
"""
from time import ctime
from subprocess import Popen
from singleMutationScan import singleMutationScan
from design import design
from suspiciousSites import suspiciousSites
from plugin import Plugin, PluginDocument
from design import design
from callabacus import InternalError, FileFormatError
from database import TableBase, Column, Text
from database import engine



class ABACUS(Plugin):

    def process(self, request):
        print('example plugin got a request:' + str(request))
        if request['action'] == 'design':
            try:
                design(request["inpath"], request["filename"], request["amount"])
            except ValueError:
                return {'success': False, 'reason': 'Invalid input'}
            except InternalError:
                return {'success': False, 'reason': 'Unknown internal errror'}
            except FileFormatError:
                return {'success': False, 'reason': 'File format error!'}
            else:
                return {'success': True, 'time': ctime()}

        elif request['action'] == 'suspiciousSites':
            try:
                design(request["inpath"], request["filename"], request["amount"])
            except ValueError:
                return {'success': False, 'reason': 'Invalid input'}
            except InternalError:
                return {'success': False, 'reason': 'Unknown internal errror'}
            except FileFormatError:
                return {'success': False, 'reason': 'File format error!'}
            else:
                return {'success': True, 'time': ctime()}

        elif request['action'] == 'singleMutationScan':
            try:
                design(request["inpath"], request["filename"], request["amount"])
            except ValueError:
                return {'success': False, 'reason': 'Invalid input'}
            except InternalError:
                return {'success': False, 'reason': 'Unknown internal errror'}
            except FileFormatError:
                return {'success': False, 'reason': 'File format error!'}
            else:
                return {'success': True, 'time': ctime()}

        elif request['action'] == 'get':
            doc = self.documents.get(request['id'])
            return {'id': doc.id, 'owner': doc.owner, 'title': doc.title, 'text': doc.text,
                    'last_modified': doc.last_modified}
        else:
            return {'success': False, 'reason': 'unknown action: ' + request['action']}


__plugin__ = ABACUS()
