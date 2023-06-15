#!/usr/bin/python3
"""
module that contains password change and reset
"""
from models.user import User
from flask_bcrypt import check_password_hash, generate_password_hash
import jwt
from api.v1.config import SECRET_KEY
from auth.email_utils import send_mail
from flask import request, make_response, abort, url_for
import datetime

@authentication_blueprint.route('/forgotpassword',
                                methods=['PUT'])
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
    user = storage.get_user(data.get('email_address'))
    if user:
        try:
            auth_token = jwt.encode({
            'email_address': user.email_address,
            'expiration': datetime.datetime.now() + datetime.timedelta(minutes=30)
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
                                      text_body='Click to set a new passwword')



