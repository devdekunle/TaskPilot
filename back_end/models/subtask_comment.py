#!/usr/bin/python3
"""
module for comments models
"""
from models.base_model import BaseModel, Base
from sqlalchemy import Column, String, ForeignKey


class SubTaskComment(BaseModel, Base):
    __tablename__ = 'subtask_comments'

    text = Column(String(1024))
    user_id = Column(String(60), ForeignKey('users.id'), nullable=False)
    subtask_id = Column(String(60), ForeignKey('subtasks.id'), nullable=False)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
