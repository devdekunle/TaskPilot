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
def create_comment(current_user, user_id, project_id):
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
    return make_response(jsonify(comment_list)), 200


