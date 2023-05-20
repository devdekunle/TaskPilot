#!/usr/bin/python3
"""
create model for user class
"""
from models.base_model import BaseModel, Base
from sqlalchemy import Column, String, ForeignKey, Integer, Table
from sqlalchemy.orm import relationship

project_user = Table('project_user', Base.metadata,
                  Column('user_id', String(60),
                        ForeignKey('user.id', onupdate='CASCADE',
                                    ondelete='CASCADE'), primary_key=True),
                  Column('project_id', String(60),
                        ForeignKey('project.id', onupdate='CASCADE',
                                    ondelete='CASCADE'), primary_key=True),
                  Column('user_role', String(60)))

task_user = Table('task_user', Base.metadata,
                  Column('user_id', String(60),
                        ForeignKey('user.id', onupdate='CASCADE',
                                    ondelete='CASCADE'), primary_key=True),
                  Column('task_id', String(60),
                        ForeignKey('task.id', onupdate='CASCADE',
                                    ondelete='CASCADE'), primary_key=True),
                  Column('member_role', String(60)))
sub_task_user = Table('sub_task_user', Base.metadata,
                  Column('user_id', String(60),
                        ForeignKey('user.id', onupdate='CASCADE',
                                    ondelete='CASCADE'), primary_key=True),
                  Column('sub_task_id', String(60),
                        ForeignKey('task.id', onupdate='CASCADE',
                                    ondelete='CASCADE'), primary_key=True),
                  Column('member_role', String(60)))

class User(BaseModel, Base):
    """ class that defines the users and members of the project"""
    __tablename__ = 'users'
    first_name = Column(String(60), nullable=False)
    last_name = Column(String(60), nullable=False)
    email_address = Column(String(60), nullable=False)
    password = Column(String(60), nullable=True)
    projects = relationship("Project", secondary=project_user,
                            back_populates='members')
    tasks = relationship("Task", secondary=task_user,
                         back_populates='members')
    sub_tasks = relationship('SubTask', secondary=sub_task_user,
                            back_populates='members')
    project_comments = relationship('Comment', backref='project_members')
    task_comments = relationship('Comment', backref='task_members')
    sub_task_comments = relationship('Comment', backref='sub_task_members')


    def __init__(self):
        
        super.__init__()
