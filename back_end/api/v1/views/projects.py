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
from models.invitation import Invitation


@api_blueprint.route('/projects/users/<user_id>', methods=['POST'])
@user_status
def create_project(current_user, user_id):
    """
    create a new project for the user
    """
    if user_id == current_user.id:
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
                project_id=new_project.id, member_role='admin')

        # add association table to projects of current user
        if p_u not in current_user.projects:
            current_user.projects.append(p_u)
            return_dict = new_project.to_dict()
            new_project.members.append(p_u)

        # commit the changes to the database
        storage.save()

        return make_response(jsonify(return_dict)), 201
    else:
        return make_response(jsonify({'Error': 'Permission Denied'})), 403

@api_blueprint.route('/projects', methods=['GET'])
@user_status
def user_projects(current_user):

    """
    retrieve all projects that the user is a part of
    """

    projects = [project.project for project in current_user.projects]
    sorted_projects = sorted(projects, key=lambda p: p.create_time, reverse=True)
    project_list = [project.to_dict() for project in sorted_projects]
    projects_count = len(project_list)
    projects_stats = {
        "projects": project_list,
        "projects_count": projects_count
    }
    return make_response(jsonify(projects_stats)), 200


@api_blueprint.route('/projects/<project_id>/users/<user_id>', methods=['DELETE'])
@user_status
def delete_project(current_user, project_id, user_id):
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
            return make_response(jsonify(response)), 404
    else:
        return(make_response(jsonify({'error': 'project_id missing'}))), 404

    invite_objs = storage.all(Invitation).values()
    for iv in invite_objs:
        if iv.project_id == project_id:
            break

    # get association objects between user and projects
    all_p_u = project.members

    # check if member is permitted to delete
    for p_u in all_p_u:
        # check association table for user and project
        if p_u.project_id == project_id and p_u.user_id == user_id:
            break
    else:
        response = {
            'Status': 'Fail',
            'Message': 'User not a part of the project'
        }
        return make_response(jsonify(response)), 404
    if p_u.member_role == 'admin':
        for pr_u in project.members:
            if pr_u.project_id == project_id:
                for iv in storage.all(Invitation).values():
                    if iv.project_id == project_id:
                        storage.delete(iv)
                project.members.remove(pr_u)
                storage.delete(pr_u)
        storage.delete(project)
        storage.save()
        return make_response(jsonify({'status': 'Project deleted'})), 204
    else:
        return make_response(jsonify({'error': 'Permission denied'})), 403

@api_blueprint.route('/projects/<project_id>/users/<user_id>', methods=['PUT'])
@user_status
def update_project(current_user, project_id, user_id):
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
            return make_response(jsonify(response)), 404
    else:
        return make_response(jsonify({'error': 'project_id missing'}))

    # get the association between users and project
    all_p_u = storage.all(ProjectUser).values()
    for obj in all_p_u:
        if obj.user_id == user_id and obj.project_id == project.id:
           p_u = obj
           break
    else:
        response = {

            'Status': 'Fail',
            'Message': 'User records not associated with this project'
        }
        return make_response(jsonify(response)), 404

    # check if member of project is permitted to update project
    if p_u.member_role == 'admin':
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
                    # check association for project
                    if p_u.project_id == project_id:
                        return make_response(jsonify(project.to_dict())), 200
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

