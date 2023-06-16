#!/usr/bin/python3
"""
API for comments by task members in a task
"""
from models.project_comment import ProjectComment
from models.project import Project
from models.user import User
from models.task import Task
from models import storage
from api.v1.views import api_blueprint
from auth.current_user import user_status
from flask import abort, make_response, request, jsonify
from models.task_comment import TaskComment

@api_blueprint.route('/users/<user_id>/tasks/<task_id>/comments',
                    methods=['POST'])
@user_status
def create_task_comment(current_user, user_id, task_id):
    """
    create a comment in a task
    """
    data = request.get_json()
    if not data:
        abort(404, 'Not a json object')
    if 'text' not in data:
        return make_response(jsonify({'Error': 'text missing'})), 400

    task = storage.get(Task, task_id)
    if not task:
        return make_response(jsonify({'error': 'task not found'})), 404
    project = storage.get(Project, task.project_id)

    for p_u in project.members:
        if p_u.user_id == user_id:
            break
    else:
        response = {
            'Status': 'Fail',
            'Message': 'Not a part of the project'
        }
        return make_response(jsonify(response)), 404

    for t_u in task.members:
        if t_u.user_id == user_id:
            break
    else:
        response = {
            'Status': 'Fail',
            'Message': 'Not a part of the task'
        }
        return make_response(jsonify(response)), 404
    comment_data = {'user_id': user_id,
                    'task_id': task.id,
                    'text': data.get('text')}
    new_task_comment = TaskComment(**comment_data)
    new_task_comment.save()

    if new_task_comment not in task.comments:
        task.comments.append(new_task_comment)
    return make_response(jsonify(new_task_comment.to_dict())), 201

@api_blueprint.route('/tasks/<task_id>/comments', methods=['GET'])
@user_status
def get_task_comments(current_user, task_id):
    """
    get all comments in a task
    """
    task = storage.get(Task, task_id)
    if not task:
        response = {
            'Status': 'Fail',
            'Message': 'Task not found'
        }
        return make_response(jsonify(response)), 404
    comments = task.comments
    sorted_comments = sorted(comments, key=lambda c: c.create_time)
    comment_list = [comment.to_dict() for comment in sorted_comments]
    comment_stat = {
        'comment_count': len(comment_list),
        'comments': comment_list
    }
    return make_response(jsonify(comment_stat)), 200

@api_blueprint.route('/users/<user_id>/tasks/<task_id>/comments/<comment_id>',
                    methods=['PUT'])
@user_status
def edit_task_comment(current_user, task_id, user_id, comment_id):
    """
    edit a comment
    """

    data = request.get_json()
    if not data:
        abort(400, 'Not a Json object')
    if 'text' not in data:
        return make_response(jsonify({'error': 'text missing'})), 400

    task = storage.get(Task, task_id)
    if not task:
        response = {
            'Status': 'Error',
            'Message': 'task not found'
        }
        return make_response(jsonify(response)), 404
    for comment in task.comments:
        if commment.id == comment_id:
            break

    else:
        response = {
            'Status': 'Fail',
            'Message': 'comment not found'
        }
        return make_response(jsonify(response)), 404

    if comment.user_id == user_id:
        for key, value in data.items():
            if key == 'text':
                setattr(comment, key, value)
                comment.update()
                return make_response(jsonify(comment.to_dict())), 200
    else:
        response = {
            'Status': 'Fail',
            'Message': 'Permission Denied, comment not made by you'
        }
        return make_response(jsonify(response)), 403

@api_blueprint.route('/users/<user_id>/tasks/<task_id>/comments/<comment_id>',
                    methods=['DELETE'])
@user_status
def delete_task_comment(current_user, task_id, user_id, comment_id):
    """
    edit a comment
    """
    task = storage.get(Task, task_id)
    if not task:
        response = {
            'Status': 'Error',
            'Message': 'task not found'
        }
        return make_response(jsonify(response)), 404
    for comment in task.comments:
        if commment.id == comment_id:
            break

    else:
        response = {
            'Status': 'Fail',
            'Message': 'comment not found'
        }
        return make_response(jsonify(response)), 404

    if comment.user_id == user_id:
        storage.delete(comment)
        storage.save()
        return make_response(), 204
    else:
        response = {
            'Status': 'Fail',
            'Message': 'Permission Denied, comment not made by you'
        }
        return make_response(jsonify(response)), 403
