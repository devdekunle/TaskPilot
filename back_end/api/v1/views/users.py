#!/user/bin/python3
"""
get all users
"""
from models import storage
from models.user import User
from models.task import Task
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
@api_blueprint.route('/users/<user_id>/projects/<project_id>', methods=['GET'])
@user_status
def get_project_member(current_user, user_id, project_id):
    """
    get a particular user from a project
    """
    project = storage.get(Project, project_id)
    if project:
        all_p_u = project.members
        for p_u in all_p_u:
            if p_u.user_id == user_id:
                return make_response(jsonify(p_u.user.to_dict())), 200
        else:
            response = {
                'Status': 'Fail',
                'Message': 'Project not found'
            }
            return make_response(jsonify(response)), 404

@api_blueprint.route('/users/tasks/<task_id>', methods=['GET'])
@user_status
def get_task_members(current_user, task_id):
    """
    Get all members in a task
    """
    task = storage.get(Task, task_id)
    if task:
        task_members = [t_u.user.to_dict() for t_u in task.members]
        return make_response(jsonify(task_members)), 200
    else:
        response = {
            'Status': 'Fail',
            'Message': 'Task not found'

        }
        return make_response(jsonify(task)), 404
