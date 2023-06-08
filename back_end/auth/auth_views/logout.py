#!/usr/bin/python3
"""
authentication and user validation
"""
from flask import Blueprint, make_response, request, jsonify, abort, url_for
from flask.views import MethodView
from models import storage
from models.user import User, SECRET_KEY
from models.token_blacklist import BlackToken
from auth.auth_views import authentication_blueprint
import jwt
from flask_bcrypt import check_password_hash
import datetime
import uuid
from functools import wraps


class Logout(MethodView):
    """
    class for the log out route
    """
    def post(self):
        #get token from header
        header = request.headers.get('Authorization')
        if header:
            auth_token = header.split(" ")[1]
        else:
            auth_token = ''
        if auth_token:
            user_data = User.decode_token(auth_token)
            # if auth_token has been successfully decoded

            if type(user_data) is not str:
                #blacklist the token
                blacklist_token = BlackToken(token=auth_token)

                try:
                    blacklist_token.save()
                    response = {
                        'status': 'Success',
                        'message': 'Logout Sucessful'}
                    return make_response(jsonify(response)), 200
                except Exception as error:
                    response = {
                        'status': 'fail',
                        'message': str(error)
                    }
                    return make_response(jsonify(response)), 200
            else:
                response = {
                    'status': 'fail',
                    'message': str(user_data)
                }
                return make_response(jsonify(response)), 401
        else:
            response = {
                'status': 'fail',
                'message': 'Token Invalid'
            }
            return make_response(jsonify(response)), 403

# define view functions
logout_view = Logout.as_view('logout_view')
# define endpoint rules
authentication_blueprint.add_url_rule(
    '/logout',
    view_func=logout_view,
    methods=['POST']

)
