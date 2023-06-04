#1/usr/bin/python3
"""
make a blueprint instance for api resources
"""
from flask import Blueprint

api_blueprint = Blueprint('api', __name__)



from api.v1.views.users import *
from api.v1.views.projects import *
from api.v1.views.tasks import *
