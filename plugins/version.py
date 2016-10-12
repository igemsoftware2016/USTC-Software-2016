from os import popen

from plugin import Plugin


class Version(Plugin):
    name = 'version'

    def process(self, request):
        p = popen('git log -n 5')
        s = p.read()
        p.close()
        return dict(gitlog=s)

__plugin__ = Version()
