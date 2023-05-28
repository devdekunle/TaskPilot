#!/usr/bin/python3
"""
module for comments models
"""
from models.base_model import BaseModel, Base
from sqlalchemy import Column, String, ForeignKey


class ProjectComment(BaseModel, Base):
    __tablename__ = 'project_comments'
    text = Column(String(1024))
    user_id = Column(String(60), ForeignKey('users.id'), nullable=False)
    project_id = Column(String(60), ForeignKey('projects.id'), nullable=False)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
