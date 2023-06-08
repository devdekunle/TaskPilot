#!/usr/bin/python3
"""
model to store invitation details
"""
from sqlalchemy import Column, String, ForeignKey
from models.base_model import BaseModel, Base

class Invitation(BaseModel, Base):
    """
    class for invitation data
    """
    __tablename__ = "invitations"
    sender_id = Column(String(60), ForeignKey('users.id'), nullable=False)
    project_id = Column(String(60), ForeignKey('projects.id'), nullable=False)
    recipient_email = Column(String(60), nullable=False)
    token = Column(String(500), nullable=False)
    member_role = Column(String(60), nullable=False)


    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
