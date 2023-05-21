#!/usr/bin/python3
"""
module for projects model
"""
from models.base_model import BaseModel, Base
from models.user import project_user
from sqlalchemy import Column, String, ForeignKey, Table, DateTime, Boolean
from sqlalchemy.orm import relationship


class Project(BaseModel, Base):
    """ Project class"""
    __tablename__ = 'projects'
    title = Column(String(60), nullable=False)
    start_date = Column(String(60), nullable=True)
    end_date = Column(String(60), nullable=True)
    completed = Column(Boolean, default=False)
    description = Column(String(1024), nullable=True)
    status = Column(String(60), default='pending')
    members = relationship('User', secondary=project_user,
                          back_populates='projects')

    tasks = relationship('Task', back_populates='projects',
                        cascade='all, delete, delete-orphan')
    comments = relationship('ProjectComment', backref='projects',
                            cascade='all, delete, delete-orphan')
    def __init__(self, *args, **kwargs):

        super().__init__(*args, **kwargs)
