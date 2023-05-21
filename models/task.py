#!/usr/bin/python3
"""
module for tasks under a project
"""
from models.base_model import BaseModel, Base
from models.user import task_user
from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship


class Task(BaseModel, Base):
    """ task class"""
    __tablename__ = 'tasks'
    project_id = Column(String(60), ForeignKey('projects.id'), nullable=False)
    title = Column(String(60), nullable=False)
    start_date = Column(String(60), nullable=True)
    end_date = Column(String(60), nullable=True)
    completed = Column(Boolean, default=False)
    description = Column(String(1024), nullable=True)
    status = Column(String(60), default='pending')
    priority = Column(String(60), default='medium')
    projects = relationship('Project', back_populates='tasks')
    sub_tasks = relationship("SubTask", back_populates='tasks',
                            cascade='all, delete, delete-orphan')
    comments = relationship("TaskComment", backref='tasks',
                            cascade='all, delete, delete-orphan')
    members = relationship("User", secondary='task_user', back_populates='tasks')
    def __init__(self, *args, **kwargs):

        super().__init__(*args, **kwargs)
