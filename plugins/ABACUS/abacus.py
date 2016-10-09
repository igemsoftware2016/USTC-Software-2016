"""This is an ABACUS plugin.
    request = {
    "action": "design" or "suspiciousSites" or "singleMutationScan"
    "id": fileID
    "inpath": inputFilePath
    "filename": filename
    "amount": amount #optional
    "tag":tag
    "design": desginpath
    "mutationScan": scanpath
    }
"""
from time import ctime
from subprocess import Popen

from singleMutationScan import singleMutationScan
from design import design
from plugin import Plugin, PluginDocument

from callabacus import InternalError, FileFormatError
from database import TableBase, Column, Text
from database import engine


class ABACUS(Plugin):

    def process(self, request):
        print("example plugin got a request:" + str(request))
        if request["action"] == "design":
            try:
                try:
                    tag = request["tag"]
                except KeyError:
                    Popen(["python3", "\"" + request["design"] + "\"",
                          "\"" + request["inpath"] + request["filename"] + "\"",
                          request["amount"]]
                          )

                else:
                    Popen(["python3", "\"" + request["design"] + "\"",
                          "\"" + request["inpath"] + "\"",
                          "\"" + request["filename"] + "\"",
                          request["amount"],
                          "\"" + tag + "\""]
                          )

                return {"status": "running"}

            except ValueError:
                return {"success": False, "reason": "Invalid input"}
            except InternalError:
                return {"success": False, "reason": "Unknown internal errror"}
            except FileFormatError:
                return {"success": False, "reason": "File format error!"}
            else:
                return {"success": True, "time": ctime()}

        elif request["action"] == "singleMutationScan":
            try:
                try:
                    size = request["size"]
                except KeyError:
                    Popen(["python3", "\"" + request["mutationScan"] + "\"",
                          "\"" + request["inpath"] + "\"",
                          "\"" + request["filename"] + "\"",
                          "\"" + request["output"] + "\""]
                          )
                else:
                    Popen(["python3", "\"" + request["mutationScan"] + "\"",
                           "\"" + request["inpath"] + "\"",
                           "\"" + request["filename"] + "\"",
                           "\"" + request["output"] + "\"",
                           size]
                          )
            except ValueError:
                return {"success": False, "reason": "Invalid input"}
            except InternalError:
                return {"success": False, "reason": "Unknown internal errror"}
            except FileFormatError:
                return {"success": False, "reason": "File format error!"}
            else:
                return {"success": True, "time": ctime()}

        else:
            return {"success": False, "reason": "unknown action: " + request["action"]}


__plugin__ = ABACUS()
