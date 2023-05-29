#!/usr/bin/python3
"""
module to blacklist a used and expired token
"""
from sqlalchemy import Column, String
from models.base_model import BaseModel, Base
import models

class BlackToken(BaseModel, Base):
    """
    class for storing used jwt tokens
    """
    __tablename__ = "blacktokens"

    token = Column(String(500), unique=True, nullable=False)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    @staticmethod
    def check_blacklist(auth_token):
        """ check if a token is blacklisted """
        response = models.storage.get_token(auth_token)
        if response:
            return True
        else:
            return False
