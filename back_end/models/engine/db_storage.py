#!/usr/bin/pyton3
"""
storage engine for database
"""
from os import getenv
import models
from models.base_model import BaseModel, Base
from models.project import Project
from models.user import User
from models.project_user import ProjectUser
from models.task_user import TaskUser
from models.subtask_user import SubTaskUser
from models.task import Task
from models.sub_task import SubTask
from models.project_comment import ProjectComment
from models.task_comment import TaskComment
from models.token_blacklist import BlackToken
from models.subtask_comment import SubTaskComment
from models.invitation import Invitation
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session


model_classes = {'user': User, 'project': Project, 'task': Task,
                'sub_task': SubTask, 'project_comment': ProjectComment,
                'task_comment': TaskComment,
                'sub_task_comment': SubTaskComment,
                'projectuser': ProjectUser, 'taskuser': TaskUser,
                'subtaskuser':SubTaskUser,
                'blacklist_token': BlackToken, 'invitation': Invitation}

class DataStorage:
    """ create and interact with databaase storage engine"""

    __engine = None
    __session = None

    def __init__(self):
        """instantiate a storage instance"""
        TPILOT_MYSQL_USER = getenv("TPILOT_MYSQL_USER")
        TPILOT_MYSQL_PWD = getenv("TPILOT_MYSQL_PWD")
        TPILOT_MYSQL_HOST = getenv("TPILOT_MYSQL_HOST")
        TPILOT_MYSQL_DB = getenv("TPILOT_MYSQL_DB")
        TPILOT_ENV = getenv("TPILOT_ENV")
        self.__engine = create_engine("mysql+mysqldb://{}:{}@{}/{}"
                                 .format(TPILOT_MYSQL_USER,
                                        TPILOT_MYSQL_PWD,
                                        TPILOT_MYSQL_HOST,
                                        TPILOT_MYSQL_DB))
        if TPILOT_ENV == "test":
            Base.metadata.drop_all(self.__engine)

    def reload(self):
        Base.metadata.create_all(self.__engine)
        session_factory = sessionmaker(bind=self.__engine, expire_on_commit=False)
        Session = scoped_session(session_factory)
        self.__session = Session

    def all(self, cls=None):
        """retrieve all instances of a model or all models """
        new_dict = {}
        for model in model_classes.values():
            if cls is model or cls is None:
                objs = self.__session.query(model).all()
                for obj in objs:
                    key = "{}.{}".format(obj.__class__.__name__, obj.id)
                    new_dict[key] = obj

        return new_dict

    def new(self, obj):
        """add a new object to the current database session"""
        self.__session.add(obj)

    def save(self):
        """ commit all changes to the current database session"""
        self.__session.commit()

    def delete(self, obj=None):
        if obj is not None:
            self.__session.delete(obj)

    def get(self, cls, id):
        if cls not in model_classes.values():
            return None

        all_obj = models.storage.all(cls)
        for value in all_obj.values():
            if value.id == id:
                return value

        return None

    def get_invite(self, token=None):
        if token is None:
            return None
        return self.__session.query(Invitation).filter_by(token=token).first()

    def get_user(self, email=None):
        if email is None:
           return None

        obj = self.__session.query(User).filter_by(email_address=email).first()
        return obj

    def get_token(self, token=None):
        if token is None:
            return None

        return self.__session.query(BlackToken).filter_by(token=token).first()

    def close(self):
        """ remove the current private session"""
        self.__session.remove()

    def expunge(self, obj=None):
        self.__session.expunge(obj)
