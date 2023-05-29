#!/usr/bin/python3
"""
authentication and user validation
"""
from flask import Blueprint

authentication_blueprint = Blueprint("auth", __name__)


from auth.views import *



