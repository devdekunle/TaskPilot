#!/usr/bin/python3
"""
model to store invitation details
"""
from sqlalchemy import Column, String, Foreign_key
from models.base_models import BaseModel, Base

class Invitation(BaseModel, Base):
    """
    class for invitation data
    """
    __tablename__ = "invitations"
    sender_id = Column(String(60), nullable=False)
    project_id = Column(String(60), nullable=False)
    recepient_email = Column(String(60), nullable=False)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
