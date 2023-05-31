#!/usr/bin/python3
"""
authentication and user validation
"""
from flask import Blueprint, make_response, request, jsonify, abort, url_for
from models import storage
from functools import wraps
from models.user import User


def user_status(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # get token from header
        header = request.headers.get("Authorization")
        if header:
            auth_token = header.split(" ")[1]
        else:
            auth_token = ""
        if auth_token:
            user_data = User.decode_token(auth_token)
            # if token is not blacklisted
            if type(user_data) is not str:
                current_user = storage.get(User,
                            user_data.get('user_id', None))

                # return current user
                return f(current_user, *args, **kwargs)
            else:
                response = {
                    'status': 'fail',
                    'message': str(user_data)
                }
                return make_response(jsonify(response)), 403
        else:
            response = {
                'status': 'fail',
                'message': 'Invalid token'
            }

    return decorated

