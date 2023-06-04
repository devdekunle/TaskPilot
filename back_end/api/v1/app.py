#!/usr/bin/python3
"""
api application instance
"""
from flask import Flask, make_response, jsonify
from flask_cors import CORS
from flask_mail import Mail, Message
from auth.auth_views import authentication_blueprint
from models import storage
from api.v1.views import api_blueprint
from auth.email_utils import mail

app = Flask(__name__)

app.config.from_pyfile('config.py')
app.register_blueprint(authentication_blueprint, url_prefix='/auth')
app.register_blueprint(api_blueprint, url_prefix='/api/v1')
mail.init_app(app)

cors = CORS(app, resources={r"/*": {"origins": '*'}})

@app.teardown_appcontext
def close_session(error):
    storage.close()

@app.errorhandler(404)
def not_found(error):
    """
    error: 404
    description: Not found
    """
    return make_response(jsonify({"error": "Not Found"}), 404)




if __name__ == "__main__":
    app.run(host='0.0.0.0', port='5000', debug=1)
