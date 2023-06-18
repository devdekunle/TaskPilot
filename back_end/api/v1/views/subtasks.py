#!/usr/bin/python3
"""
SubTask API
"""
from models import storage
from models.sub_task import SubTask
from models.task import Task
from models.project import Project
from auth.current_user import user_status
from flask import make_response, jsonify, request, abort
from models.user import User
from api.v1.views import api_blueprint
from models.subtask_user import SubTaskUser


@api_blueprint.route('/tasks/<task_id>/users/<user_id>/subtasks', methods=['POST'])
@user_status
def create_subtask(current_user, task_id, user_id):
    """
    create a subtask for a project
    """
    if current_user:
        subtask_data = request.get_json()
        if not subtask_data:
            abort(404)

        if 'title' not in subtask_data:
            response = {
                'Status': 'Fail',
                'Message': 'Title is Missing'
            }
            return make_response(jsonify(response)), 400
        task = storage.get(Task, task_id)
        if task:
            # check if member is part of project
            all_t_u = task.members
            for t_u in all_t_u:
                # get the project to create task for
                if t_u.task_id == task.id and t_u.user_id == user_id:
                        break
            else:
                response = {
                    'status': 'Fail',
                    'message': 'task and user association not found'
                }
                return make_response(jsonify(response)), 404
        else:
            response = {
                'Status': 'Fail',
                'Message': 'Task not found'
            }
            return make_response(jsonify(response)), 404

        project = storage.get(Project, task.project_id)
        if project:
            for p_u in project.members:
                if p_u.project_id == project.id and p_u.user_id == user_id:
                    break

            else:
                response = {
                    'Status': 'Fail',
                    'Message': 'User are not a part of this project'
                }
                return make_response(jsonify(response)), 404
        else:
            response = {
                'Status': 'Fail',
                'Message': 'Project not found'
            }
            return make_response(jsonify(response)), 404


        if t_u.member_role == 'team_lead' or p_u.member_role == 'admin':
            #create a new subtask
            subtask_data['task_id'] = task_id
            new_subtask = SubTask(**subtask_data)
            new_subtask.save()

            # create user and task association
            s_u = SubTaskUser(subtask_id=new_subtask.id,
                     user_id=user_id)

            if s_u not in current_user.subtasks:
                current_user.subtasks.append(s_u)
                return_dict = new_subtask.to_dict()
                new_subtask.members.append(s_u)

                storage.save()
                return make_response(jsonify(return_dict)), 201
        else:
            response = {
                'status': 'Fail',
                'message': 'Permission denied'
                }
            return make_response(jsonify(response)), 403
@api_blueprint.route('/tasks/<task_id>/subtasks', methods=['GET'])
@user_status
def get_task_subtasks(current_user, task_id):
    """
    get the tasks for a project
    """
    subtasks = [s_u.subtask for s_u in current_user.subtasks \
                if s_u.subtask.task_id == task_id]
    sorted_subtasks = sorted(subtasks, key=lambda s: s.create_time, reverse=True)
    subtask_list = [subtask.to_dict() for subtask in sorted_subtasks]
    return make_response(jsonify(subtask_list)), 200

@api_blueprint.route('/subtasks/<subtask_id>', methods=['GET'])
@user_status
def get_subtask(current_user, subtask_id):
    """
    get a single task
    """
    if subtask_id:
        # get all available subtasks
        all_subtasks = current_user.subtasks
        if all_subtasks is not None:
            # get subtask to return from database
            subtask = storage.get(SubTask, subtask_id)
            if subtask:
                for s_u in all_subtasks:
                    if s_u.subtask_id == subtask_id:
                        return make_response(jsonify(subtask.to_dict())), 200
                else:
                    response = {
                        'Status': 'Fail',
                        'Message': 'SubTask association not found'
                    }
                    return make_response(jsonify(response)), 404

            else:
                response = {
                    'Status': 'Fail',
                    'Message': 'SubTask not found'

                }
                return make_response(jsonify(response)), 404
        else:
            response = {
                'Status': 'Fail',
                'Message': 'No subtasks created'
            }
            return make_response(jsonify(response)), 400
    else:
        response = {
            'Status': 'Fail',
            'Message': 'subtask_id missing'
        }
        return make_response(jsonify(response)), 400

@api_blueprint.route('/subtasks/<subtask_id>', methods=['PUT'])
@user_status
def update_subtask(current_user, subtask_id):
    """
    update a task with new attributes
    """
    if subtask_id:
        # get task to update from database
        subtask = storage.get(SubTask, subtask_id)
        if not subtask:
            response = {
                'status': 'Fail',
                'message': 'SubTask not found'
            }
            return make_response(jsonify(response)), 404
    else:
        response = {
            'status': 'Fail',
            'message': 'subtask_id missing'
        }
        return make_response(jsonify(response)), 400

    subtask_data = request.get_json()
    if not subtask_data:
        response = {

            'status': 'Fail',
            'message': 'Not a JSON object'
        }
        return make_response(jsonify(response)), 400

    for key, value in subtask_data.items():
        # set updated attributes
        if key not in ['id', 'create_at', 'update_at', 'task_id']:
            setattr(subtask, key, value)

    # update update_time
    subtask.update()
    return make_response(jsonify(subtask.to_dict())), 200


@api_blueprint.route('/subtasks/<subtask_id>', methods=['DELETE'])
@user_status
def delete_subtask(current_user, subtask_id):
    """
    delete a task
    """
    if subtask_id:
        subtask = storage.get(SubTask, subtask_id)
        if not subtask:
            response = {
                'Status': 'Fail',
                'Message': 'SubTask doesn\'t exist'
            }
            return make_response(jsonify(response)), 404

        for s_u in subtask.members:
            if s_u.subtask_id == subtask_id:
                current_user.subtasks.remove(s_u)
                storage.delete(s_u)
            continue
        storage.delete(subtask)
        storage.save()
        response = {
            'Status': 'Success',
            'Message': 'SubTask deleted'
        }
        return make_response(jsonify(response)), 204
