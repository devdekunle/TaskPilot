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


@api_blueprint.route('/projects', methods=['POST'])
@user_status
def create_project(current_user):
    """
    create a new project for the user
    """

    #get json data
    project_data = request.get_json()
    if not project_data:
        abort(404)

    if 'title' not in project_data:
        response = {
            'status': "fail",
            'message': 'Title is missing'
        }
        return make_response(jsonify(response))

    # create new project in database
    new_project = Project(**project_data)
    new_project.save()

    # create association table between project and users
    p_u = ProjectUser(user_id=current_user.id,
            project_id=new_project.id, member_role='owner')

    # add association table to projects of current user
    if p_u not in current_user.projects:
        current_user.projects.append(p_u)

    storage.save()

    return make_response(jsonify(new_project.to_dict())), 201


@api_blueprint.route('projects/', methods=['GET'])
@user_status
def user_projects(current_user):

    """
    retrieve all projects that the user is a part of
    """
    all_projects = [project.project.to_dict() for project in current_user.projects]
    return make_response(jsonify(all_projects)), 200













