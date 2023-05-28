#!/usr/bin/python3
"""
create model for user class
"""
import os
from models.base_model import BaseModel, Base
from sqlalchemy import Column, String, ForeignKey, Integer, Table, Boolean
from sqlalchemy.orm import relationship
import datetime
import jwt
from flask_bcrypt import generate_password_hash
SECRET_KEY = "\xa3(\x95\xe6\x7f\xb3\xf1\x85o\xc6\xfe\x05\xe55\xfe|d\xf1\xc4\xe0\x1a\xc5[`S\xcd\xe2\x92~k%\xa7"

class User(BaseModel, Base):
    """ class that defines the users and members of the project"""
    __tablename__ = 'users'
    first_name = Column(String(255), nullable=False)
    admin = Column(Boolean, default=True)
    last_name = Column(String(255), nullable=False)
    email_address = Column(String(255), nullable=False, unique=True)
    password = Column(String(255), nullable=False)
    projects = relationship("ProjectUser", back_populates='user')
    tasks = relationship("TaskUser", back_populates='user')
    subtasks = relationship('SubTaskUser', back_populates='user')
    project_comments = relationship('ProjectComment',
                                    backref='members',
                                    cascade='all, delete, delete-orphan')
    task_comments = relationship('TaskComment', backref='members',
                                cascade='all, delete, delete-orphan')
    subtask_comments = relationship('SubTaskComment',
                                    backref='members',
                                    cascade='all, delete, delete-orphan')

    def __init__(self, *args, **kwargs):

        super().__init__(*args, **kwargs)

        for key, value in kwargs.items():
            if  key == 'password':
                self.password = generate_password_hash(value, 10).decode()


    def encode_token(self, user_id):
        """
        generate and return a token created from user_id
        return: jwt token
        """
        try:
            payload = {
                'sub': user_id,
                'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes=5),
                'iat' : datetime.datetime.utcnow()
                }
            return jwt.encode(
                    payload,
                    SECRET_KEY,
                    algorithm='HS256'

                )
        except Exception as error:
            return error

    @staticmethod
    def decode_token(auth_token):
        """
        decodes the authentication token
        args: auth_token
        return: string
        """
        try:
            payload = jwt.decode(auth_token, SECRET_KEY)
            return payload['sub']
        except jwt.ExpiredSignatureError:
            return "Token expired, please log in again"
        except jwt.InvalidTokenError:
            return "Invalid token, please log in again"
