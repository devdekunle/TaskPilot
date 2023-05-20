#!/usr/bin/python3
"""
module for projects model
"""
from models.base_model import BaseModel, Base
from models.user import project_user
from sqlalchemy import Column, String, ForeignKey, Table
from sqlalchemy.orm import relationship


class Project(BaseModel, Base):
    """ Project class"""
    __tablename__ = 'projects'
    title = Column(String(60), nullable=False)
    start_date = Column(String(60))
    end_date = Column(String(60))
    description = Column(String(1024), nullable=False)
    status = Column(Boolean, default=False)
    members = relationship('User', secondary=project_user,
                          back_populates='projects')

    tasks = relationship('Task', back_populates='projects')
    comments = relationship('Comment', backref='projects')

    def __init__(self, *args, **kwargs):
        
        super().__init__(*args, **kwargs)
