#!/usr/bin/python3
"""
authentication and user validation
"""
from flask import Blueprint, make_response, request, jsonify, abort
from flask.views import MethodView
from models import storage
from models.user import User

authentication_blueprint = Blueprint("auth", __name__)


from auth.views import *



