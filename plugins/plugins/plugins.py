"""This plugin can search other plugins, list them and auto-load some plugins."""

from os import listdir, path

from plugin import Plugin, plugin_manager


class Plugins(Plugin):
    auto_load_list_file = 'plugins/plugins/auto_load_list'

    def __init__(self):
        super().__init__()
        for p in self.auto_load_list:
            plugin_manager.load_plugin(p)

    @property
    def auto_load_list(self) -> list:
        with open(Plugins.auto_load_list_file) as f:
            return eval(f.read())

    @auto_load_list.setter
    def auto_load_list(self, val):
        with open(Plugins.auto_load_list_file, 'w') as f:
            f.write(repr(val))

    def process(self, request):
        return getattr(self, request['action'])(**request)

    def list(self, **_):
        result = {}
        loaded = plugin_manager.get_plugins()
        for f in listdir(plugin_manager.plugin_directory):
            if path.isdir(f):
                name = f
            else:
                name, _, postfix = f.rpartition('.')
                if postfix not in ('py', 'pyc', 'pyd'):
                    continue
            if name.startswith('_'):
                continue
            state = name in loaded
            result[name] = state
        return {'list': repr(result), 'auto': repr(self.auto_load_list)}

    @staticmethod
    def enable(name, **_):
        plugin_manager.load_plugin(name)
        return {}

    @staticmethod
    def disable(name, **_):
        plugin_manager.unload_plugin(name)
        return {}

    def auto_enable(self, name, **_):
        l = self.auto_load_list
        if name not in l:
            l.append(name)
            self.auto_load_list = l
        return {}

    def auto_disable(self, name, **_):
        l = self.auto_load_list
        if name in l:
            l.remove(name)
            self.auto_load_list = l
        return {}


print('plugins')
