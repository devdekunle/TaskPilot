#!/usr/bin/python3
"""
authentication and user validation
"""
from flask import Blueprint

authentication_blueprint = Blueprint("auth", __name__)


from auth.auth_views.registration import *
from auth.auth_views.login import *
from auth.auth_views.logout import *
from auth.auth_views.invitation import *
from auth.auth_views.password import *


