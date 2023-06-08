#!/usr/bin/python3
"""
module that contains the logic for inviting a user to a project
"""
from models.user import User, SECRET_KEY
from models.project import Project
from models.project_user import ProjectUser
from models import storage
from models.invitation import Invitation
from auth.auth_views import authentication_blueprint
from auth.current_user import user_status
from flask import jsonify, make_response, abort, request, url_for
from auth.email_utils import send_mail
import jwt
import datetime


@authentication_blueprint.route('/invite/senders/<sender_id>/projects/<project_id>',
                                methods=['POST'])
@user_status
def invite_member(current_user, sender_id, project_id):
    """
    invites a member to a project
    """
    # check if inviter and project exists
    user = storage.get(User, sender_id)
    project = storage.get(Project, project_id)
    all_p_u = current_user.projects
    if user and project:
        for p_u in all_p_u:
            if p_u.user_id == user.id and p_u.project_id == project.id:
                break
        else:
            response = {
                'Status': 'Fail',
                'Message': 'User not associated with project'
            }
            return make_response(jsonify(response)), 404

        if p_u.member_role == 'admin' or p_u.user_id == current_user.id:
            invite_data = request.get_json()
            if not invite_data:
                abort(400, 'Not a JSON object')

            if "recipient_email" not in invite_data:
                abort(400, " recipient_email missing")

            if "member_role" not in invite_data:
                abort(400, "member_role missing")

            # check if invitee is a registered user
            existing_user = storage.get_user(invite_data.get('recipient_email', None))

            #generate invite link
            if existing_user:
                try:
                    #generate jwt token
                    auth_token = jwt.encode(
                        {
                            "email_address": existing_user.email_address,
                            "user_id": existing_user.id,
                            "exp": datetime.datetime.now() + datetime.timedelta(hours=24)
                        },
                        SECRET_KEY,
                        algorithm='HS256'
                    )

                    invite_data['sender_id'] = user.id
                    invite_data['token'] = auth_token.decode('utf-8')
                    invite_data['project_id'] = project.id

                    #create invitation instance
                    new_invite = Invitation(**invite_data)
                    new_invite.save()

                    # create invite link
                    link = url_for('auth.accept_invite', token=auth_token.decode('utf-8'),
                            _external=True)
                    sub = "{} {} invites you to a TaskPilot project"

                    #send invite_link
                    mail_response = send_mail(
                        subject=sub.format(user.first_name, user.last_name),
                        recipients=[invite_data['recipient_email']],
                        sender="taskpilot0@gmail.com",
                        text_body="Click to join project {}",
                        link=link,
                        token=auth_token.decode('utf-8')
                        )
                    return make_response(jsonify(mail_response)), 200
                except Exception as error:

                    response = {'Status': 'Fail',
                        'Message': str(error)
                        }
                    return make_response(jsonify(response)), 400

            else:
                pass

        else:
            response = {
                'Status': 'Fail',
                'Message': 'Permission Denied'

            }
            return make_response(jsonify(response)), 403
    else:
        response = {
            'Status': 'Fail',
            'Message': 'Sender or Project doesn\'t exist'
        }
        return make_response(jsonify(response)), 404


@authentication_blueprint.route('/verify_invite/<token>', methods=['GET'])
@user_status
def accept_invite(current_user, token):

    if token:
        try:
            payload = User.decode_token(token)
            if type(payload) is not str:
                invitee = storage.get_invite(payload['email_address'])
                if invitee:
                    p_u_data = {
                        'project_id': invitee.project_id,
                        'user_id': payload['user_id'],
                        'member_role': invitee.member_role
                    }
                    project = storage.get(Project, invitee.project_id)
                    p_u = ProjectUser(**p_u_data)

                    if p_u not in current_user.projects:
                        current_user.projects.append(p_u)
                        project.members.append(p_u)

                    storage.save()
                    response = {
                        'Status': 'Success',
                        'Message': 'User successfully invited to project'
                    }
                    return make_response(jsonify(response)), 200
                else:
                    response = {
                        'Status': 'Fail',
                        'Message': 'Invitation record not found'
                    }
                    return make_response(jsonify(response)), 404
            else:
                response = {
                    'Status': 'Fail',
                    'Message': 'Token is used and blacklisted'
                }
                return make_response(jsonify(response)), 400
        except jwt.ExpiredSignatureError:
            return 'Token Expired'
        except jwt.InvalidTokenError:
            return 'Token is invalid'
    else:
        return 'Please supply a token'