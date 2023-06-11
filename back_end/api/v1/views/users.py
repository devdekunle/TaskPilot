#!/user/bin/python3
"""
get all users
"""
from models import storage
from models.user import User
from models.task import Task
from models.project import Project
from models.project_user import ProjectUser
from models.task_user import TaskUser
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
            user_dict = {'user_details': p_u.user.to_dict(),
                        'member_role': p_u.member_role}
            project_members.append(user_dict)
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
            if p_u.user_id == user_id and p_u.project_id == project_id:
                response = {
                    'user_details': p_u.user.to_dict(),
                    'member_role': p_u.member_role
                }
                return make_response(jsonify(response)), 200
        else:
            response = {
                'Status': 'Fail',
                'Message': 'User not associated with project'
            }
            return make_response(jsonify(response)), 404
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
        all_t_u = task.members
        task_members = []
        for t_u in all_t_u:
            if t_u.task_id == task_id:
                user_dict = {
                    'user_details': t_u.user.to_dict(),
                    'member_role': t_u.member_role
                }
                task_members.append(user_dict)
        return make_response(jsonify(task_members)), 200
    else:
        response = {
            'Status': 'Fail',
            'Message': 'Task not found'

        }
        return make_response(jsonify(task)), 404

@api_blueprint.route('/users/<user_id>/tasks/<task_id>', methods=['GET'])
@user_status
def get_task_member(current_user, user_id, task_id):
    """
    get a particular user from a project
    """
    task = storage.get(Task, task_id)
    if task:
        all_t_u = task.members
        for t_u in all_t_u:
            if t_u.user_id == user_id and t_u.task_id == task_id:
                user_dict = {
                    'user_details': t_u.user.to_dict(),
                    'member_role': t_u.member_role
                }
                return make_response(jsonify(user_dict)), 200
        else:
            response = {
                'Status': 'Fail',
                'Message': 'User not associated with project'
            }
            return make_response(jsonify(response)), 404
    else:
        response = {
            'Status': 'Fail',
            'Message': 'Task not found'
        }
        return make_response(jsonify(response)), 404


@api_blueprint.route('/users/<user_id>/projects/<project_id>/role', methods=['PUT'])
@user_status
def change_user_role(current_user, user_id, project_id):
    """
    change a user role in a project
    """
    project = storage.get(Project, project_id)
    user_data = request.get_json()
    if not user_data:
        abort(404, 'Not a JSON')
    if "member_role" not in user_data:
        return make_response(jsonify({'error': 'member_role missing'})), 400
    if "email_address" not in user_data:
        return make_response(jsonify({'error': 'email missing'})), 400
    # get user to update role using email
    if user_data.get("email_address") != current_user.email_address:
        user = storage.get_user(user_data.get('email_address'))
    else:
        response = {
            "Status": "Fail",
            "Message": "Cannot change current_user role"
        }
        return make_response(jsonify(response)), 400
    if user:
        for p_u in project.members:
            if p_u.user.id == user_id and p_u.project_id == project_id:
                break
    else:
        response = {
            'Status': 'Fail',
            'Message': 'User to update doesnt\'t exist'
        }
        return make_response(jsonify(response)), 404
    if p_u.member_role == 'admin':
        for p_u in project.members:
            if p_u.user_id == user.id and p_u.project_id == project_id:
                for key, value in user_data.items():
                    if key == 'member_role':
                        setattr(p_u, key, value)
        else:
            response = {
                'Status': 'Fail',
                'Message': 'User not part of the project'
            }
        p_u.update()
        return make_response(jsonify({'new_role': p_u.member_role}))
    else:
        response = {
            'Status': 'Fail',
            'Message': 'Permission Denied'
            }
        return make_response(jsonify(response)), 404

@api_blueprint.route('/add/users/<user_id>/tasks/<task_id>', methods=['POST'])
@user_status
def add_to_task(current_user, user_id, task_id):
    """ add a user to a task
    """
    data = request.get_json()
    if not data:
        abort(400, 'Not a JSON')
    if 'email_address' not in data:
        return make_response(jsonify({'error': 'Email address missing'})), 400

    task = storage.get(Task, task_id)
    if task:
        for t_u in task.members:
            if t_u.task_id == task.id:
                existing_user = storage.get(User, t_u.user_id)
                if existing_user.email_address == data.get('email_address'):
                    response = {
                        'Status': 'Fail',
                        'Message': 'User already a member of the task'

                    }
                    return make_response(jsonify(response)), 400
        for t_u in task.members:
            if t_u.task_id == task.id and t_u.user_id == user_id:
                break
    else:
        response = {
            "Status": "Fail",
            "Message": "Task not Found"
        }
        return make_response(jsonify(response)), 404


    project = storage.get(Project, task.project_id)
    for p_u in project.members:
        if p_u.project_id == project.id and p_u.user_id == user_id:
            break
    if data.get("email_address") != current_user.email_address:
        user = storage.get_user(data.get('email_address', None))
    else:
        response = {
            "Status": "Fail",
            "Message": "Cannot invite current_user"}
        return make_response(jsonify(response)), 400
    if user:
        if p_u.member_role == 'admin' or t_u.member_role == 'team_lead':

            new_t_u = TaskUser(user_id=user.id, task_id=task.id, member_role='member')

            if new_t_u not in current_user.tasks:
                user.tasks.append(new_t_u)
                task.members.append(new_t_u)
                storage.save()
                response = {
                    'Status': 'Success',
                    'Message': 'User successfully added to task'
                }
                return make_response(jsonify(response)), 201
        else:
            response = {
                'Status': 'Fail',
                'Message': 'Permission Denied'
            }
            return make_response(jsonify(response)), 403
    else:
        response = {
            'Status': 'Fail',
            'Message': 'Invited user doesn\'t exist'
        }
        return make_response(jsonify(response)), 404
