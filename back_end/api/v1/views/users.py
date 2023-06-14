#!/user/bin/python3
"""
get all users
"""
from models import storage
from models.user import User
from models.task import Task
from models.sub_task import SubTask
from models.subtask_user import SubTaskUser
from models.project import Project
from models.project_user import ProjectUser
from models.task_user import TaskUser
from auth.current_user import user_status
from flask import jsonify, abort, make_response, request
from flask.views import MethodView
from api.v1.views import api_blueprint
from auth.email_utils import send_mail


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
        # check all project_user association for members of project
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
            # check all task_user association for members of a task
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
    get a particular user from a task
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

@api_blueprint.route('/users/subtasks/<subtask_id>', methods=['GET'])
@user_status
def get_subtask_members(current_user, subtask_id):
    """
    Get all members in a task
    """
    subtask = storage.get(SubTask, subtask_id)
    if subtask:
        all_t_u = subtask.members
        subtask_members = []
        for s_u in all_t_u:
            # check all task_user association for members of a task
            if s_u.subtask_id == subtask_id:
                subtask_members.append(s_u.user.to_dict())
        return make_response(jsonify(subtask_members)), 200
    else:
        response = {
            'Status': 'Fail',
            'Message': 'SubTask not found'

        }
        return make_response(jsonify(response)), 404


@api_blueprint.route('/users/<user_id>/projects/<project_id>/role', methods=['PUT'])
@user_status
def change_project_member_role(current_user, user_id, project_id):
    """
    change a user role in a project
    """
    project = storage.get(Project, project_id)
    if not project:
        response = {
            'Status': 'Fail',
            'Message': 'Project doesn\'t exist'
        }
        return make_response(jsonify(response)), 404
    user_data = request.get_json()
    if not user_data:
        abort(404, 'Not a JSON')
    if "member_role" not in user_data:
        return make_response(jsonify({'error': 'member_role missing'})), 400
    if "email_address" not in user_data:
        return make_response(jsonify({'error': 'email missing'})), 400
    # retrieve use whose role will be updated using their email

    # confirm if user to add to task is not account holder
    if user_data.get("email_address") != current_user.email_address:
        user = storage.get_user(user_data.get('email_address'))
    else:
        response = {
            "Status": "Fail",
            "Message": "Cannot change current_user role"
        }
        return make_response(jsonify(response)), 400
    if user:
        # check for admin user to perform operation
        for p_u in project.members:
            if p_u.user.id == user_id and p_u.project_id == project_id:
                break
        else:
            response = {
                'Status': 'Fail',
                'Message': 'User not found in project'
            }
            return make_response(jsonify(response)), 404
    else:
        response = {
            'Status': 'Fail',
            'Message': 'User to update doesnt\'t exist'
        }
        return make_response(jsonify(response)), 404
    if p_u.member_role == 'admin':
        for pr_u in project.members:
            # check if user is a member of the project
            if pr_u.user_id == user.id and pr_u.project_id == project_id:
                for key, value in user_data.items():
                    if key == 'member_role':
                        setattr(pr_u, key, value)
                pr_u.update()
                return make_response(jsonify({'New project role': pr_u.member_role}))
        else:
            response = {
                'Status': 'Fail',
                'Message': 'User not part of the project'
            }
    else:
        response = {
            'Status': 'Fail',
            'Message': 'Permission Denied'
            }
        return make_response(jsonify(response)), 404

@api_blueprint.route('/users/<user_id>/tasks/<task_id>/add', methods=['POST'])
@user_status
def add_to_task(current_user, user_id, task_id):
    """ add a user to a task
    """
    data = request.get_json()
    if not data:
        abort(400, 'Not a JSON')
    if 'email_address' not in data:
        return make_response(jsonify({'error': 'Email address missing'})), 400
    if 'member_role' not in data:
        return make_response(jsonify({'error': 'member_role missing'})), 400

    user = storage.get_user(data.get('email_address'))
    if not user:
        response = {
            'Status': 'Fail',
            'Message': 'user to add to task doesn\'t exist'
        }
        return make_response(jsonify(response)), 404

    task = storage.get(Task, task_id)
    if task:
        for t_u in task.members:
            if t_u.user_id == user.id and t_u.task_id == task_id:
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
    if user:
        if p_u.member_role == 'admin' or t_u.member_role == 'team_lead':

            new_t_u = TaskUser(user_id=user.id, task_id=task.id,
                    member_role=data.get('member_role'))

            if new_t_u not in user.tasks:
                user.tasks.append(new_t_u)
                task.members.append(new_t_u)
                storage.save()

                response = {
                    'Status': 'Success',
                    'Message': 'User successfully added to task'
                }
                return make_response(jsonify(response)), 200
        else:
            response = {
                'Status': 'Fail',
                'Message': 'Permission Denied'
            }
            return make_response(jsonify(response)), 403

@api_blueprint.route('/users/<user_id>/subtasks/<subtask_id>/assign',
                methods=['POST'])
@user_status
def assign_subtask(current_user, subtask_id, user_id):
    """
    assign a subtask to a user
    """
    data = request.get_json()
    if not data:
        abort(400, 'not a JSON object')
    if 'email_address' not in data:
        return make_response(jsonify({'error': 'email_adrress missing'})), 400

    user = storage.get_user(data.get('email_address'))
    if not user:
        response = {
            'Status': 'Fail',
            'Message': 'User to assign task doesn\'t exist'
        }
        return make_response(jsonify(response)), 404

    subtask = storage.get(SubTask, subtask_id)
    if subtask:
        for s_u in subtask.members:
            if s_u.subtask_id == subtask_id and s_u.user_id == user.id:
                response = {
                    'Status': 'Fail',
                    'Message': 'user already assigned subtask'
                }
                return make_response(jsonify(response)), 400
    else:
        response = {
            'Status': 'Fail',
            'Message': 'Subtask not found'
        }
        return make_response(jsonify(response)), 404
    task = storage.get(Task, subtask.task_id)
    for t_u in task.members:
        if t_u.task_id == task.id and t_u.user == user_id:
            break

    project = storage.get(Project, task.project_id)
    for p_u in project.members:
        if p_u.project_id == project.id and p_u.user_id == user_id:
            break
    if user:
        if p_u.member_role == 'admin' or t_u.member_role == 'team_lead':
            new_s_u = SubTaskUser(user_id=user.id, subtask_id=subtask.id)

            if new_s_u not in user.subtasks:
                user.subtasks.append(new_s_u)
                subtask.members.append(new_s_u)
                storage.save()
                response = {
                    'Status': 'Success',
                    'Message': 'User successfully assigned subtask'
                }
                return make_response(jsonify(response)), 200
        else:
            response = {
                'Status': 'Fail',
                'Message': 'Permission Denied'
            }
            return make_response(jsonify(response)), 403

@api_blueprint.route('/users/<user_id>/tasks/<task_id>/role',
                methods=['PUT'])
@user_status
def change_task_member_role(current_user, task_id, user_id):
    """
    change a task member's role
    """
    task = storage.get(Task, task_id)
    if not task:
        response = {
            'Status': 'Fail',
            'Message': 'Task doesn\'t exist'
        }
        return make_response(jsonify(response)), 404
    user_data = request.get_json()
    if not user_data:
        abort(404, 'Not a JSON')
    if "member_role" not in user_data:
        return make_response(jsonify({'error': 'member_role missing'})), 400
    if "email_address" not in user_data:
        return make_response(jsonify({'error': 'email missing'})), 400
    # retrieve use whose role will be updated using their email

    # confirm if user to add to update is not account holder
    if user_data.get("email_address") != current_user.email_address:
        user = storage.get_user(user_data.get('email_address'))
    else:
        response = {
            "Status": "Fail",
            "Message": "Cannot change current_user role"
        }
        return make_response(jsonify(response)), 400
    project = storage.get(Project, task.project_id)
    if user:
        # check for admin user to perform operation
        for p_u in project.members:
            if p_u.user_id == user_id and p_u.project_id == project.id:
                break

        else:
            response = {

                'Status': 'Fail',
                'Message': 'User not found in project'
            }
            return make_response(jsonify(response)), 404
    else:
        response = {
            'Status': 'Fail',
            'Message': 'User to update doesnt\'t exist'
        }
        return make_response(jsonify(response)), 404
    if p_u.member_role == 'admin':
        for t_u in task.members:
            # check if user is a member of the project
            if t_u.user_id == user.id and t_u.task_id == task_id:
                # update member_role of task_user association
                for key, value in user_data.items():
                    if key == 'member_role':
                        setattr(t_u, key, value)
                t_u.update()
                return make_response(jsonify({'New Team role': t_u.member_role}))
        else:
            response = {
                'Status': 'Fail',
                'Message': 'User not part of the task'
            }
    else:
        response = {
            'Status': 'Fail',
            'Message': 'Permission Denied'
            }
        return make_response(jsonify(response)), 404

@api_blueprint.route('/users/<user_id>/projects/<project_id>',
                    methods=['DELETE'])
@user_status
def remove_user_from_project(current_user, user_id, project_id):
    """
    remove a user from project
    """
    # get json data
    data = request.get_json()
    if not data:
        abort(400, "Not a JSON object")
    if 'email_address' not in data:
        return make_response(jsonify({'Error': 'Email address missing'})), 400
    if data.get('email_address') == current_user.email_address:
        response = {
            'Status': 'Fail',
            'Message': 'Cannot remove account owner from project'
        }
        return make_response(jsonify(response)), 400

    # get instance of user to remove from project
    user = storage.get_user(data.get('email_address'))
    if user:
        project = storage.get(Project, project_id)
        if project:
            for pr_u in project.members:
                if pr_u.project_id == project_id and pr_u.user_id == user_id:
                    break
            else:
                response = {
                    'Status': 'Fail',
                    'Message': 'No project user association found'

                }
                return make_response(jsonify(response)), 404
            if pr_u.member_role == 'admin':
                # check all members of the project
                for p_u in project.members:
                    # remove user from from project
                    if p_u.user_id == user.id and p_u.project_id == project_id:
                        project.members.remove(p_u)
                        storage.delete(p_u)

                # remove user from all tasks of the project
                for task in storage.all(Task).values():
                    if task.project_id == project_id:
                        for t_u in task.members:
                            if t_u.user_id == user.id and t_u.task_id == task.id:
                                task.members.remove(t_u)
                                storage.delete(t_u)
                    # remove user from all subtasks of each task
                            for subtask in storage.all(SubTask).values():
                                if subtask.task_id == task.id:
                                    for s_u in subtask.members:
                                        if s_u.user_id == user.id and s_u.subtask_id == subtask.id:
                                            subtask.members.remove(s_u)
                                            storage.delete(s_u)
                        storage.save()
                        response = {
                            'Status': 'Success',
                            'Message': 'USer successfully removed from project'
                        }
                        return make_response(jsonify(response)), 204
            else:
                response = {
                    'Status': 'Fail',
                    'Message': 'Permission Denied'
                }
                return make_response(jsonify(response)), 403
        else:
            response = {
                'Status': 'Fail',
                'Message': 'Project doesn\'t exist'
            }
            return make_response(jsonify(response)), 404
    else:
        response = {
            'Status': 'Fail',
            'Message': 'User to remove from project does not exist'
        }
        return make_response(jsonify(response)), 404

@api_blueprint.route('/users/<user_id>/tasks/<task_id>', methods=['DELETE'])
@user_status
def remove_user_from_task(current_user, user_id, task_id):
    """
    remove a user from a task
    """
    data = request.get_json()
    if not data:
        abort(400, "Not a JSON object")
    if 'email_address' not in data:
        return make_response(jsonify({'Error': 'Email address missing'})), 400

    # get instance of user to remove from task
    user = storage.get_user(data.get('email_address'))
    if not user:
        response = {
            'Status': 'Fail',
            'Message': 'user to remove from task does not exist'
        }
        return make_response(jsonify(response)), 404
    task = storage.get(Task, task_id)
    if task:
        for t_u in task.members:
            if t_u.user_id == user_id and t_u.task_id == task_id:
                break
        else:
            response = {
                'Status': 'Fail',
                'Message': 'no task user association found'
            }
            return make_response(jsonify(response)), 404
    else:
        response = {
            'Status': 'Fail',
            'Message': 'Task doesn\'t exist'
        }
        return make_response(jsonify(response)), 404
    project = storage.get(Project, task.project_id)
    for p_u in project.members:
        if p_u.user_id == user_id and p_u.project_id == project.id:
            break
    if t_u.member_role == 'team_lead' or p_u.member_role == 'admin':
        for t_u in task.members:
            if t_u.user_id == user.id and t_u.task_id == task.id:
                task.members.remove(t_u)
                storage.delete(t_u)

        for subtask in storage.all(SubTask).values():
            if subtask.task_id == task.id:
                for s_u in subtask.members:
                    if s_u.user_id == user.id and s_u.subtask_id == subtask.id:
                        subtask.members.remove(s_u)
                        storage.delete(s_u)
                        storage.save()
                response = {
                    'Status': 'Success',
                    'Message': 'User successfully removed from task'
                }
                return make_response(jsonify(response)), 204
    else:
        response == {
            'Status': 'Fail',
            'Message': 'Permission Denied'
        }
        return make_response(jsonify(response)), 403

@api_blueprint.route('/users/<user_id>/subtasks/<subtask_id>',
                     methods=['DELETE'])
@user_status
def remove_user_from_subtask(current_user, user_id, subtask_id):
    """
    remove a user from a subtask
    """
    data = request.get_json()
    if not data:
        abort(400, "Not a JSON object")
    if 'email_address' not in data:
        return make_response(jsonify({'Error': 'Email address missing'})), 400

    # get instance of user to remove from subtask
    user = storage.get_user(data.get('email_address'))
    if user:
        subtask = storage.get(SubTask, subtask_id)
        if subtask:
            task = storage.get(Task, subtask.task_id)
            for t_u in task.members:
                if t_u.user_id == user_id and t_u.task_id == task.id:
                    break
            else:
                response = {
                    "Status": "Fail",
                    "Message": "User not part of task"
                }
                return make_response(jsonify(response)), 404
            project = storage.get(Project, task.project_id)
            for p_u in project.members:
                if p_u.user_id == user_id and p_u.project_id == project.id:
                    break
            if p_u.member_role == 'admin' or t_u.member_role == 'team_lead':
                for s_u in subtask.members:
                    if s_u.user_id == user.id and s_u.subtask_id == subtask_id:
                        subtask.members.remove(s_u)
                        storage.delete(s_u)
                        storage.save()
                        response = {
                            'Status': 'Success',
                            'Message': 'User successfully removed from subtask'
                        }
                        return make_response(jsonify(response)), 204
                else:
                    response = {
                    'Status': 'Fail',
                    'Message': 'User to remove is not a part of the subtask'
                    }
                    return make_response(jsonify(response)), 404
            else:
                response = {
                    'Status': 'Fail',
                    'Message': 'Permission Denied'
                }
                return make_response(jsonify(response)), 403
        else:
            response = {
                'Status': 'Fail',
                'Message': 'Subtask not found'
            }
            return make_response(jsonify(response)), 404
    else:
        response = {
            'Status': 'Fail',
            'Message': 'User to remove from subtask doesn\'t exist'
        }
        return make_response(jsonify(response)), 404
