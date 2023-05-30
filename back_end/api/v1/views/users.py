#!/user/bin/python3
"""
get all users
"""
from models import storage
from models.user import User
from auth.current_user import user_status
from flask import jsonify, abort, make_response, request
from flask.views import MethodView
from api.v1.views import api_blueprint

@api_blueprint.route('/users', methods=['GET'])
@user_status
def get_user(current_user):

    if not current_user.admin:
        return 'Permission denied'



    all_users = storage.all(User).values()
    list_users = [user.to_dict() for user in all_users]
    return make_response(jsonify(current_user.tasks)), 200
