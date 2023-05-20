#!/usr/bin/python3
"""
module for tasks under a project
"""
from models.base_model import BaseModel, Base
from models.user import sub_task_user
from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship


class SubTask(BaseModel, Base):
    """ task class"""
    __tablename__ = 'sub_tasks'
    project_id = Column(String(60), ForeignKey('tasks.id'), nullable=False)
    status = Column(String(60), default='pending')
    priority = Column(String(60), default='medium')
    sub_tasks = relationship("SubTask", back_populates='tasks')
    comments = relationship("Comment", backref='tasks')
    members = relationship("User", secondary='task_user', back_populates='tasks')

