#!/usr/bin/python3
"""
create model for user class
"""
from models.base_model import BaseModel, Base
from sqlalchemy import Column, String, ForeignKey, Integer, Table, Boolean
from sqlalchemy.orm import relationship

class SubTaskUser(BaseModel, Base):
    __tablename__ = 'sub_task_user'
    user_id = Column(String(60), ForeignKey('users.id',
                                            ondelete='CASCADE',
                                            onupdate='CASCADE'))
    subtask_id = Column(String(60), ForeignKey('subtasks.id',
                                        ondelete='CASCADE',
                                        onupdate='CASCADE'))

    user = relationship('User', back_populates='subtasks',
                        cascade='all, delete')
    subtask = relationship('SubTask', back_populates='members',
                           cascade='all, delete')
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
