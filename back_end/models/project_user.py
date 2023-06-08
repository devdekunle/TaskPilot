#!/usr/bin/python3
"""
create model for user class
"""
from models.base_model import BaseModel, Base
from sqlalchemy import Column, String, ForeignKey, Integer, Table, Boolean
from sqlalchemy.orm import relationship

class ProjectUser(BaseModel, Base):

    __tablename__ = "project_user"

    user_id = Column(String(60), ForeignKey('users.id'),
                    primary_key=True)
    project_id = Column(String(60), ForeignKey('projects.id'),
                        primary_key=True)
    member_role = Column(String(60))

    user = relationship('User', back_populates='projects')
    project = relationship('Project', back_populates='members')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
