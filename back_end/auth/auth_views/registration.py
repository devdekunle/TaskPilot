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

pending_users = {}
class Register(MethodView):
    """
    for user registration
    """

    def post(self):
        #get the data from the post request
        user_data = request.get_json()

        if user_data:
            # check if user is already registered
            existing_user = storage.get_user(user_data.get('email_address', None))
            if not existing_user:
                try:
                    # save pending user data temporarily to verify email
                    pending_user_id = str(uuid.uuid4())
                    pending_users[pending_user_id] = user_data
                    # generate token using email
                    auth_token = jwt.encode(
                        {'email_address': user_data['email_address'],
                        'user_id': pending_user_id,
                        'exp': datetime.datetime.now() + datetime.timedelta(minutes=50)
                        },
                        SECRET_KEY,
                        algorithm='HS256'

                        )
                    # create email verification link
                    #link = url_for('auth.verify_email_view', token=auth_token.decode(), _external=True)
                    link = 'https://www.taskpilot.me/auth/token-verification?token={}'.format(auth_token.decode())

                    mail_response = send_mail(subject='Confirm Email Address',
                        sender='taskpilot0@gmail.com',
                        recipients=[user_data['email_address']],
                        text_body='Please click the link to verify your email {}',
                        link=link
                        )

                    return make_response(jsonify(mail_response)), 200

                except Exception as error:
                    #response = {'status': 'fail', 'message': 'Error occurred'}
                    return jsonify(str(error))
            else:
                response = {
                    'status': 'fail',
                    'message': 'Email already exists'
                }
                return make_response(jsonify(response)), 400
        else:
            response = {
                'status': 'fail',
                'message': 'Invalid request'
             }
            return make_response(jsonify(response)), 500

    def get(self, token):

        if token:
            try:
                # decode token from verification link
                payload = User.decode_token(token)

                #if token has not been used before to sign up
                if type(payload) is not str:
                    user_data = pending_users[payload['user_id']]

                    #blacklist token after user signs up
                    blacklist_token = BlackToken(token=token)
                    blacklist_token.save()

                    # create new user in database
                    new_user = User(**user_data)
                    new_user.save()

                    # delete user from pending list
                    if payload['user_id'] in pending_users.keys():
                        del pending_users[payload['user_id']]
                        response = {
                            'status': 'Success',
                            'message': 'Verification successful'
                        }
                    return make_response(jsonify(response)), 201
                else:
                    response = {
                        'status': 'fail',
                        'message': 'Token is used and blacklisted'
                    }
                    return make_response(jsonify(response)), 400
            except jwt.ExpiredSignatureError:
                return "Token Expired! Please register again"
            except jwt.InvalidTokenError:
                return "Token is invalid!, please use the correct token"
            except KeyError as e:
                return str(e)
        else:
            return "Please supply a token!"


# define view functions
registration_view = Register.as_view('register_view')
email_verification_view = Register.as_view('verify_email_view')
# define endpoint rules
authentication_blueprint.add_url_rule(
    '/register',
    view_func=registration_view,
    methods=['POST']
    )

authentication_blueprint.add_url_rule(
    '/verify_email/<token>',
    view_func=email_verification_view,
    methods=['GET']
    )
