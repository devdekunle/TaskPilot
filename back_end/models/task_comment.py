#!/usr/bin/python3
"""
module for comments models
"""
from models.base_model import BaseModel, Base
from sqlalchemy import Column, String, ForeignKey


class TaskComment(BaseModel, Base):
    __tablename__ = 'task_comments'

    text = Column(String(1024))
    user_id = Column(String(60), ForeignKey('users.id'), nullable=False)
    task_id = Column(String(60), ForeignKey('tasks.id'), nullable=False)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
