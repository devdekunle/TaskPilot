#!/usr/bin/python3
"""
create model for user class
"""
from models.base_model import BaseModel, Base
from sqlalchemy import Column, String, ForeignKey, Integer, Table, Boolean
from sqlalchemy.orm import relationship

class TaskUser(BaseModel, Base):
    __tablename__ = "task_user"
    user_id = Column(String(60), ForeignKey('users.id'),
                    primary_key=True)
    task_id = Column(String(60), ForeignKey('tasks.id'),
                    primary_key=True)
    member_role = Column(String(60))

    user = relationship('User', back_populates='tasks')
    task = relationship('Task', back_populates='members')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

