from flask import Blueprint, redirect, url_for, request
from flask_login import current_user, login_required, login_user, logout_user
from models import User
from plugin import plugin_manager
import json

plugin = Blueprint('plugin', __name__)


@plugin.route('/', methods=['GET', 'POST'])
def plugin_request():
    plugin_name = request.values['plugin'] if 'plugin' in request.values else ''
    req = {v: request.values[v] for v in request.values}
    if 'file' in request.files and request.files['file'].filename:
        req['file'] = request.files['file']
        print('Got a file:', request.files['file'].filename)
    rtv = plugin_manager.send_request(plugin_name, req)
    return json.dumps(rtv)
