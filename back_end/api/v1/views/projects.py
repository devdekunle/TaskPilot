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
        return make_response(jsonify(response)), 404

    # create new project in database
    new_project = Project(**project_data)
    new_project.save()

    # create association table between project and users
    p_u = ProjectUser(user_id=current_user.id,
            project_id=new_project.id, member_role='owner')

    # add association table to projects of current user
    if p_u not in current_user.projects:
        current_user.projects.append(p_u)
        return_dict = new_project.to_dict()
        new_project.members.append(p_u)

    # commit the changes to the database
    storage.save()

    return make_response(jsonify(return_dict)), 201


@api_blueprint.route('/projects', methods=['GET'])
@user_status
def user_projects(current_user):

    """
    retrieve all projects that the user is a part of
    """
    all_projects = [project.project.to_dict() for project in current_user.projects]
    return make_response(jsonify(all_projects)), 200


@api_blueprint.route('/users/<user_id>/projects/<project_id>', methods=['DELETE'])
@user_status
def delete_project(current_user, user_id, project_id):
    """
    delete a project only permitted by an admin or owner
    """

    if project_id:
        # get project from database
        project = storage.get(Project, project_id)
        if not project:
            response = {
                'status': 'fail',
                'message': 'Project doesn\'t exist'
            }
            return make_response(jsonify(response)), 400
    else:
        return(make_response(jsonify({'error': 'project_id missing'}))), 404

    # get association objects between user and projects
    all_p_u = current_user.projects

    # check if member is permitted to delete
    for p_u in all_p_u:
        if p_u.user_id == user_id and p_u.project.id == project_id:
            if p_u.member_role == 'admin' or p_u.member_role == 'owner':
                current_user.projects.remove(p_u)
                storage.delete(p_u)
                storage.delete(project)
                storage.save()
                return make_response(jsonify({'status': 'Project deleted'})), 200
            else:
                return make_response(jsonify({'error': 'Permission denied'})), 403
        else:
            response = {
                'status': 'fail',
                'message': 'You are not a part of this project'
                }
            return make_response(jsonify(response)), 404


@api_blueprint.route('/users/<user_id>/projects/<project_id>', methods=['PUT'])
@user_status
def update_project(current_user, user_id, project_id):
    """
    update a property of a project based on a permitted user
    """

    # get the project
    if project_id:
        project = storage.get(Project, project_id)
        if not project:
            response = {
                'status': 'fail',
                'message': 'Project doesn\'t exist'
            }
            return make_response(jsonify(response)), 400
    else:
        return make_response(jsonify({'error': 'project_id missing'}))

    # get the association between users and project
    all_p_u = storage.all(ProjectUser).values()
    for obj in all_p_u:
        if obj.user_id == user_id and obj.project_id == project.id:
           p_u = obj
           break
    # check if member of project is permitted to update project
    if p_u.member_role == 'owner' or p_u.member_role == 'admin':
        # get the json data
        data = request.get_json()

        if not data:
            response = {
                'status': 'fail',
                'message': 'Not a JSON'
            }
            return make_response(jsonify(response)), 400
        # update attributes with new data
        for key, value in data.items():
            if key not in ['id', 'create_at', 'update_at']:
                setattr(project, key, value)

        # update update_time
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
        # get project from database
        all_pu_obj = current_user.projects
        if all_pu_obj is not None:
            project = storage.get(Project, project_id)
            if project:
                for p_u in all_pu_obj:
                    if p_u.project_id == project_id:
                        return make_response(jsonify(project.to_dict())), 200
                    else:
                        response = {
                            'status': 'fail',
                            'message': 'No project found'
                        }
                        return make_response(jsonify(response)), 404

            else:
                response = {
                    'status': 'fail',
                    'message': 'Project doesn\'t exist'
                }
                return make_response(jsonify(response)), 404
    else:
        response = {
            'status': 'fail',
            'message': 'project_id missing'
        }
        return make_response(jsonify(response)), 404

