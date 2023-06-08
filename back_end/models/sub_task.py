#!/usr/bin/python3
"""
module for tasks under a project
"""
from models.base_model import BaseModel, Base
from models.subtask_user import SubTaskUser
from sqlalchemy import Column, String, Integer, ForeignKey, Boolean
from sqlalchemy.orm import relationship


class SubTask(BaseModel, Base):
    """ subtask class"""
    __tablename__ = 'subtasks'
    task_id = Column(String(60), ForeignKey('tasks.id'), nullable=False)
    title = Column(String(60), nullable=False)
    start_date = Column(String(60), nullable=True)
    end_date = Column(String(60), nullable=True)
    completed = Column(Boolean, default=False)
    description = Column(String(1024), nullable=True)
    status = Column(String(60), default='pending', nullable=True)
    priority = Column(String(60), default='medium', nullable=True)
    tasks = relationship("Task", back_populates='subtasks')
    comments = relationship("SubTaskComment", backref='subtasks',
                            cascade='all, delete, delete-orphan')
    members = relationship("SubTaskUser", back_populates='subtask',
                           cascade='all, delete',
                           foreign_keys=[SubTaskUser.subtask_id])
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
