#!/usr/bin/python3

from flask import Flask
from auth.views import auth_blueprint

app = Flask(__name__)

app.register_blueprint(authentication_blueprint)


if __name__ == "__main__":
    app.run(host=0.0.0.0, port=5000, debug=1)
