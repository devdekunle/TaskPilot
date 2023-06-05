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


@api_blueprint.route('/users/projects/<project_id>', methods=['GET'])
@user_status
def get_project_members(current_user, project_id):
    """
    get all users in a project
    """
    project = storage.get(Project, project_id)
    project_members = []
    if project:
        all_p_u = project.members
        for p_u in all_p_u:
            project_members.append(p_u.user.to_dict())
        return make_response(jsonify(project_members)), 200
    else:
        response = {

            'Status': 'Fail',
            'Message': 'Project not found'
        }
        return make_response(jsonify(response)), 404
