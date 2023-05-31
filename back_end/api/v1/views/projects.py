#!/user/bin/python3
"""
Projects API
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

    # commit the changes to the database
    storage.save()

    return make_response(jsonify(new_project.to_dict())), 201


@api_blueprint.route('/projects', methods=['GET'])
@user_status
def user_projects(current_user):

    """
    retrieve all projects that the user is a part of
    """
    all_projects = [project.project.to_dict() for project in current_user.projects]
    return make_response(jsonify(all_projects)), 200


@api_blueprint.route('/users/<user_id>/projects/<project_id>', methods=['PUT'])
@user_status
def update_project(current_user, user_id, project_id):
    """
    update a property of a project based on a permitted user
    """

    # get the user
    if user_id:
        user = storage.get(User, user_id)
        print(user)
        if not user:
            abort(404, "user doesn't exist")
    else:
        return make_response(jsonify({'error': 'user_id missing'}))

    # get the project
    if project_id:
        project = storage.get(Project, project_id)
        if not project:
            abort(404, "project doesn't exist")
    else:
        return make_response(jsonify({'error': 'project_id missing'}))

    # get the association between users and project
    all_p_u = storage.all(ProjectUser).values()
    for obj in all_p_u:
        if obj.user_id == user.id and obj.project_id == project.id:
           p_u = obj
           break
    if p_u.member_role == 'owner' or p_u.member_role == 'admin':
        # get the json data
        data = request.get_json()

        if not data:
            response = {
                'status': 'fail',
                'message': 'Not a JSON'
            }
            return make_response(jsonify(response)), 400
        for key, value in data.items():
            if key not in ['id', 'create_at', 'update_at']:
                setattr(project, key, value)

        project.update()
        return make_response(jsonify(project.to_dict())), 200
    else:
        response = {
            'status': 'fail',
            'message': 'Permission denied'
        }
        return make_response(jsonify(response)), 403

@api_blueprint.route('/projects/<project_id>', methods=['GET'])
@user_status
def get_one_project(current_user, project_id):
    """
    get a single project
    """
    if project_id:
        project = storage.get(Project, project_id)

        return make_response(jsonify(project.to_dict())), 200
    else:
        response = {
            'status': 'fail',
            'message': 'project_id missing'
        }
        return make_response(jsonify(response)), 404
