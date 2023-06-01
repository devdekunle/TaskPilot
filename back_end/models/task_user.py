#!/usr/bin/python3
"""
create model for user class
"""
from models.base_model import BaseModel, Base
from sqlalchemy import Column, String, ForeignKey, Integer, Table, Boolean
from sqlalchemy.orm import relationship

class TaskUser(BaseModel, Base):
    __tablename__ = "task_user"
    user_id = Column(String(60), ForeignKey('users.id', ondelete='CASCADE',
                                        onupdate='CASCADE'))
    task_id = Column(String(60), ForeignKey('tasks.id', ondelete='CASCADE',
                                            onupdate='CASCADE'))
    member_role = Column(String(60))

    user = relationship('User', back_populates='tasks',
                        cascade='all, delete')
    task = relationship('Task', back_populates='members',
                        cascade='all, delete')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

