#!/usr/bin/python3
"""
Task API
"""
from models import storage
from models.task import Task
from auth.current_user import user_status
from flask import make_response, jsonify, request, abort
from models.user import User
from models.project import Project
from api.v1.views import api_blueprint
from models.task_user import TaskUser


@api_blueprint.route('/projects/<project_id>/users/<user_id>/tasks',
                    methods=['POST'])
@user_status
def create_task(current_user, project_id, user_id):
    """
    create a task for a project
    """
    if current_user:
        task_data = request.get_json()
        if not task_data:
            abort(404)

        if 'title' not in task_data:
            response = {
                'Status': 'Fail',
                'Message': 'Title is Missing'
            }
            return make_response(jsonify(response)), 400


        project = storage.get(Project, project_id)
        if project:
            # check if member is part of project
            all_p_u = project.members
            for p_u in all_p_u:
                # get the project to create task for
                if p_u.project_id == project_id:
                    if p_u.user_id == user_id:
                        break
            else:
                response = {
                    'status': 'Fail',
                    'message': 'project and user association not found'
                }
                return make_response(jsonify(response)), 404

            if p_u.member_role == 'admin':
                #create a new task
                task_data['project_id'] = project_id
                new_task = Task(**task_data)
                new_task.save()
                # create user and task association
                t_u = TaskUser(task_id=new_task.id,
                        user_id=user_id)

                if t_u not in current_user.tasks:
                    current_user.tasks.append(t_u)
                    return_dict = new_task.to_dict()
                    new_task.members.append(t_u)

                    storage.save()
                    return make_response(jsonify(return_dict)), 201
            else:
                response = {
                'status': 'Fail',
                'message': 'Permission denied'
                }
                return make_response(jsonify(response)), 403
        else:
            response = {
                'Status': 'Fail',
                'Message': 'Project not found'
            }
            return make_response(jsonify(response)), 404

@api_blueprint.route('/projects/<project_id>/tasks', methods=['GET'])
@user_status
def get_project_tasks(current_user, project_id):
    """
    get the tasks for a project
    """
    tasks = [t_u.task for t_u in current_user.tasks \
                if t_u.task.project_id == project_id]
    sorted_tasks = sorted(tasks, key=lambda t: t.create_time, reverse=True)
    task_list = [task.to_dict() for task in sorted_tasks]
    return make_response(jsonify(task_list)), 200

@api_blueprint.route('/tasks', methods=['GET'])
@user_status
def get_all_tasks(current_user):
    """
    Get all tasks a user is part of
    """
    all_tasks = storage.all(Task).values()
    task_list = []
    for task in all_tasks:
        for t_u in current_user.tasks:
            if t_u.task.id == task.id:
                task_list.append(task)
    sorted_tasks = sorted(task_list, key=lambda t: t.create_time, reverse=True)
    task_list = [task.to_dict() for task in sorted_tasks]
    return make_response(jsonify(task_list))

@api_blueprint.route('/tasks/<task_id>', methods=['GET'])
@user_status
def get_task(current_user, task_id):
    """
    get a single task
    """
    if task_id:
    # get all available tasks
        all_tasks = current_user.tasks
        if all_tasks is not None:
            # get task to return from database
            task = storage.get(Task, task_id)
            if task:
                for t_u in all_tasks:
                    if t_u.task_id == task_id:
                        return make_response(jsonify(task.to_dict())), 200
                else:
                    response = {
                        'Status': 'Fail',
                        'Message': 'Task not found'
                    }
                    return make_response(jsonify(response)), 404

            else:
                response = {
                    'Status': 'Fail',
                    'Message': 'Task not found'

                }
                return make_response(jsonify(response)), 404
        else:
            response = {
                'Status': 'Fail',
                'Message': 'No tasks created'
            }
            return make_response(jsonify(response)), 400

@api_blueprint.route('tasks/<task_id>/users/<user_id>',
                        methods=['PUT'])
@user_status
def update_task(current_user, task_id, user_id):
    """
    update a task with new attributes
    """
        # get task to update from database
    task = storage.get(Task, task_id)
    if not task:
        response = {
            'status': 'Fail',
            'message': 'Task not found'
        }
        return make_response(jsonify(response)), 400
    task_data = request.get_json()

    if not task_data:
        response = {

            'status': 'Fail',
            'message': 'Not a JSON object'
        }
        return make_response(jsonify(response)), 400
    # get project and check if user is part of the project
    project = storage.get(Project, task.project_id)
    for p_u in project.members:
        if p_u.project_id == project.id and p_u.user_id == user_id:
            break

    else:
        response = {
            'Status': 'Fail',
            'Message': 'User not associated with Project'
        }
        return make_response(jsonify(response)), 404

    all_t_u = storage.all(TaskUser).values()
    for t_u in all_t_u:
        # get user and task association
        if t_u.user_id == user_id and t_u.task_id == task_id:
            task_user = t_u
            break

    else:
        response = {
            'Status': 'Fail',
            'Message': 'User records not found for the task'
        }
        return make_response(jsonify(response)), 404

    # check if user making update is permitted
    if task_user.member_role == 'team_lead' or p_u.member_role == 'admin':

        for key, value in task_data.items():
            # set updated attributes
            if key not in ['id', 'create_at', 'update_at', 'project_id']:
                setattr(task, key, value)

        # update update_time
        task.update()
        return make_response(jsonify(task.to_dict())), 200
    else:
        response = {
            'Status': 'Fail',
            'Message': 'Permission Denied'

        }
        return make_response(jsonify(response)), 403

@api_blueprint.route('/tasks/<task_id>/users/<user_id>', methods=['DELETE'])
@user_status
def delete_task(current_user, task_id, user_id):
    """
    delete a task
    """
    if task_id:
        # get task to delete
        task = storage.get(Task, task_id)
        if not task:
            response = {
                'Status': 'Fail',
                'Message': 'Task doesn\'t exist'
            }
            return make_response(jsonify(response)), 404
        # get the project
        project = storage.get(Project, task.project_id)
        for p_u in project.members:
            # check if user is part of project
            if p_u.project_id == project.id and p_u.user_id == user_id:
                break
        else:
            response = {
                'Status': 'Fail',
                'Message': 'User are not a part of the project'
            }
            make_response(jsonify(response)), 404
        for t_u in task.members:
            # check if user is part of the task
            if t_u.task_id == task_id and t_u.user_id == user_id:
                if t_u.member_role == 'team_lead' or p_u.member_role == 'admin':
                    current_user.tasks.remove(t_u)
                    storage.delete(t_u)
                else:
                    response = {
                        'Status': 'Fail',
                        'Message': 'Permission Denied'
                    }
                    return make_response(jsonify(response)), 403
            else:
                continue
        storage.delete(task)
        storage.save()
        response = {
            'Status': 'Success',
            'Message': 'Task deleted'
        }
        return make_response(jsonify(response)), 204
