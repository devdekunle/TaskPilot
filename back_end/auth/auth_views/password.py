#!/usr/bin/python3
"""
module that contains password change and reset
"""
from models.user import User
from flask_bcrypt import check_password_hash, generate_password_hash
import jwt
from api.v1.config import SECRET_KEY
from auth.email_utils import send_mail
from flask import request, make_response, abort, url_for, jsonify
import datetime
from auth.auth_views import authentication_blueprint
from flask_bcrypt import generate_password_hash
from models import storage
from models.token_blacklist import BlackToken

@authentication_blueprint.route('/forgot_password',
                                methods=['POST'])
def forget_password():
    """
    allow user to change password if forgotten
    """
    data = request.get_json()
    if not data:
        abort(400, 'Not a JSON object')
    if 'email_address' not in data:
        response = {
            'Status': 'Fail',
            'Message': 'email_address missing'
        }
        return make_response(jsonify(response)), 400
    # get the user's email
    user = storage.get_user(data.get('email_address'))
    if user:
        try:

            auth_token = jwt.encode({
            'email_address': user.email_address,
            'exp': datetime.datetime.now() + datetime.timedelta(minutes=30)
            },
            SECRET_KEY,
            algorithm='HS256'
            )
            link = url_for('auth.set_password',
                token=auth_token.decode('utf-8'), _external=True)

            mail_response = send_mail(subject='Password Reset',
                sender='taskpilot0@gmail.com',
                recipients=[user.email_address],
                link=link,
                text_body='Click to set a new password {}')

            return make_response(jsonify(mail_response)), 200
        except Exception as error:
            response = {'Status': 'Fail', 'Message': 'Error Occured'}
            return make_response(jsonify(response)), 400
    else:
        response = {'Status': 'Fail', 'Message': 'Email does not exist'}
        return make_response(jsonify(response)), 404

@authentication_blueprint.route('/setpassword/<token>', methods=['PUT'])
def set_password(token):
    """
    set the new password
    """
    data = request.get_json()
    if not data:
        abort(400, 'Not a JSON object')
    if 'password' not in data:
        response = {'Status': 'Fail', 'Message': 'password missing'}
        return make_response(jsonify(response)), 400
    try:
        payload = User.decode_token(token)
        if type(payload) is not str:
            # get the user to reset password
            user = storage.get_user(payload.get('email_address'))

            # blacklist the token
            blacklist_token = BlackToken(token=token)
            blacklist_token.save()

            # update the password
            user.password = generate_password_hash(data.get('password'))
            user.update()
            response = {
                'Status': 'Success',
                'Message': 'Password change successful'
            }
            return make_response(jsonify(response)), 200
        else:
            response = {
                'Status': 'Fail',
                'Message': 'Token is used and blacklisted'
            }
            return make_response(jsonify(response)), 400
    except jwt.ExpiredSignatureError:
        return 'TokenExpired'
    except jwt.InvalidTokenError:
        return 'Invalid Token'

