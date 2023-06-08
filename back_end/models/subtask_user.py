#!/usr/bin/python3
"""
create model for user class
"""
from models.base_model import BaseModel, Base
from sqlalchemy import Column, String, ForeignKey, Integer, Table, Boolean
from sqlalchemy.orm import relationship

class SubTaskUser(BaseModel, Base):
    __tablename__ = 'sub_task_user'
    user_id = Column(String(60), ForeignKey('users.id'),
                    primary_key=True)
    subtask_id = Column(String(60), ForeignKey('subtasks.id'),
                        primary_key=True)

    user = relationship('User', back_populates='subtasks')
    subtask = relationship('SubTask', back_populates='members')
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
