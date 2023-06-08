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
from auth.email_utils import mail, Message, send_mail
from functools import wraps

class Login(MethodView):
    """
    Resource for user login
    """
    def post(self):
        #get the user login data
        login_data = request.get_json()

        try:
            # get user data from database
            current_user = storage.get_user(
                        login_data.get('email_address', None))
            if current_user:
                # check if password is correct
                if check_password_hash(
                    current_user.password, login_data.get('password', None)):

                    # create token from id
                    auth_token = current_user.encode_token(
                                current_user.id)
                    response = {
                        'status': 'Success',
                        'message': 'Login successful',
                        'auth_token': auth_token.decode('UTF-8'),
                        'user_details': current_user.to_dict()
                        }
                    return make_response(jsonify(response)), 200
                else:
                    response = {
                        'status': 'fail',
                        'message': 'Incorrect password'
                    }
                    return make_response(jsonify(response)), 404
            else:
                response = {
                    'status': 'fail',
                    'message': 'Email address doesn\'t exist!'
                }
                return make_response(jsonify(response)), 404

        except Exception as error:
            response = {
                'status': 'fail',
                'message': 'Login failed, try again!'

            }
            return make_response(jsonify(response)), 500

# define view functions
login_view = Login.as_view('login_view')
# define endpoint rules

authentication_blueprint.add_url_rule(
    '/login',
    view_func=login_view,
    methods=['POST']
    )
