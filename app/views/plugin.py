from flask import Blueprint, redirect, url_for, request
from flask_login import current_user, login_required, login_user, logout_user
from models import User
from plugin import plugin_manager
import json

plugin = Blueprint('plugin', __name__)


@plugin.route('/', methods=['GET', 'POST'])
def plugin_request():
    plugin_name = request.values['plugin']
    rtv = plugin_manager.send_request(plugin_name, {v: request.values[v] for v in request.values})
    return json.dumps(rtv)
