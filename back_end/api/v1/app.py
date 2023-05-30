#!/usr/bin/python3
"""
api application instance
"""
from flask import Flask
from flask_mail import Mail, Message
from auth.auth_views import authentication_blueprint
from api.v1.views import api_blueprint
from auth.email_utils import mail

app = Flask(__name__)

app.config.from_pyfile('config.py')
app.register_blueprint(authentication_blueprint, url_prefix='/auth')
app.register_blueprint(api_blueprint, url_prefix='/api/v1')

mail.init_app(app)




if __name__ == "__main__":
    app.run(host='0.0.0.0', port='5000', debug=1)
