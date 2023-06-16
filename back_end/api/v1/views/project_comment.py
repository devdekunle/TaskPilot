#!/usr/bin/python3
"""
project comments API
"""
from models.project_comment import ProjectComment
from models.project import Project
from models.user import User
from models import storage
from api.v1.views import api_blueprint
from auth.current_user import user_status
from flask import abort, make_response, request, jsonify

@api_blueprint.route('/users/<user_id>/projects/<project_id>/comments/',
                      methods=['POST'])
@user_status
def create_project_comment(current_user, user_id, project_id):
    """
    write a comment
    """
    data = request.get_json()

    if not data:
        abort(400, 'Not a JSON object')
    if 'text' not in data:
        abort(400, 'text missing')
    project = storage.get(Project, project_id)
    if not project:
        response = {
            'Status': 'Fail',
            'Message': 'Project not found'
        }
        return make_response(jsonify(response)), 404
    user = storage.get(User, user_id)
    if not user:
        response = {
            'Status': 'Fail',
            'Message': 'User does not exist'
        }
        return make_response(jsonify(response)), 404

    for p_u in project.members:
        if p_u.user_id == user.id and p_u.project_id == project.id:
            comment_data = {'text': data.get('text'),
                            'user_id': user.id,
                            'project_id':project.id
                            }
            new_comment = ProjectComment(**comment_data)
            new_comment.save()

            if new_comment not in project.comments:
                project.comments.append(new_comment)
            return make_response(jsonify(new_comment.to_dict())), 201
    else:
        response = {
            'Status': 'Fail',
            'Message': 'not a part of this project'
        }
        return make_response(jsonify(response)), 404

@api_blueprint.route('/projects/<project_id>/comments', methods=['GET'])
@user_status
def get_project_comments(current_user, project_id):
    """
    get all comments of a project
    """
    project = storage.get(Project, project_id)
    if not project:
        return make_response(jsonify({'Error': 'Project does not exist'})), 404
    comments = project.comments
    sorted_comments = sorted(comments, key=lambda c: c.create_time)
    comment_list = [comment.to_dict() for comment in sorted_comments]
    comment_stat = {
        'comment_count': len(comment_list),
        'comments': comment_list
    }
    return make_response(jsonify(comment_stat)), 200

@api_blueprint.route('/users/<user_id>/projects/<project_id>/comments/<comment_id>',
                    methods=['PUT'])
@user_status
def edit_project_comment(current_user, project_id, user_id, comment_id):
    """
    edit a comment
    """
    data = request.get_json()
    if not data:
        abort(400, 'Not a json object')
    if 'text' not in data:
        return make_response(jsonify({'error': 'text missing'}))
    project = storage.get(Project, project_id)
    if project:
        for comment in project.comments:
            if comment.id == comment_id:
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
                "Status": "Fail",
                "Message": "Permission Denied, Comment not made by you"
            }
            return make_response(jsonify(response)), 403
    else:
        response = {
        "Status": "Fail",
        "Message": "project not found"}
        return make_response(jsonify(response)), 404

@api_blueprint.route('/users/<user_id>/projects/<project_id>/comments/<comment_id>',
                    methods=['DELETE'])
@user_status
def delete_project_comment(current_user, project_id, user_id, comment_id):
    """
    edit a comment
    """
    project = storage.get(Project, project_id)
    if project:
        for comment in project.comments:
            if comment.id == comment_id:
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
                "Status": "Fail",
                "Message": "Permission Denied, Comment not made by you"
            }
            return make_response(jsonify(response)), 403
    else:
        response = {
        "Status": "Fail",
        "Message": "project not found"}
        return make_response(jsonify(response)), 404

