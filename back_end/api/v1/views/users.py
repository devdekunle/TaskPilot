#!/user/bin/python3
"""
get all users
"""
from models import storage
from models.user import User
from models.project import Project
from models.project_user import ProjectUser
from auth.current_user import user_status
from flask import jsonify, abort, make_response, request
from flask.views import MethodView
from api.v1.views import api_blueprint

@api_blueprint.route('/users', methods=['GET'])
@user_status
def get_users(current_user):
    """
    get all users
    """
    all_users = [user.to_dict() for user in storage.all(User).values()]
    return make_response(jsonify(all_users)), 200

