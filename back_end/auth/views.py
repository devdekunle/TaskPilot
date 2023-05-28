#!/usr/bin/python3
"""
authentication and user validation
"""
from flask import Blueprint, make_response, request, jsonify, abort, url_for
from flask.views import MethodView
from models import storage
from models.user import User, SECRET_KEY
from auth import authentication_blueprint
import jwt
from flask_bcrypt import check_password_hash
import datetime
import uuid
from auth.email_utils import mail, Message, email_verify


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
                    link = url_for('auth.verify_email', token=auth_token.decode('utf-8'),
                               _external=True)
                    # send verification mail
                    mail_response = email_verify(subject='Confirm Email Address',
                        sender='taskpilot0@gmail.com',
                        recipients=[user_data['email_address']],
                        text_body='Please click the link to verify your email {}',
                        link=link,
                        token=auth_token.decode('utf-8')
                        )

                    return make_response(jsonify(mail_response)), 200

                except Exception as error:
                    response = {'status': 'fail', 'message': 'Error occurred'}
                    return make_response(jsonify(response)), 400
            else:
                response = {
                    'status': 'fail',
                    'message': 'This account is already registered'
                }
                return make_response(jsonify(response)), 202
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
                payload = jwt.decode(token, SECRET_KEY)
                user_data = pending_users[payload['user_id']]

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
            except jwt.ExpiredSignatureError:
                return "Token Expired! Please register again"
            except jwt.InvalidTokenError:
                return "Token is invalid!, please use the correct token"
            except KeyError as e:
                return 'Account created, please login to continue'
        else:
            return "Please supply a token!"


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
                        'auth_token': auth_token.decode('UTF-8')
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
registration_view = Register.as_view('register_api')

# define endpoint rules
authentication_blueprint.add_url_rule(
    '/register',
    view_func=registration_view,
    methods=['POST']
    )

login_view = Login.as_view('login_api')
authentication_blueprint.add_url_rule(
    '/login',
    view_func=login_view,
    methods=['POST']
    )
email_verification_view = Register.as_view('verify_email')
authentication_blueprint.add_url_rule(
    '/verify_email/<token>',
    view_func=email_verification_view,
    methods=['GET']
    )
