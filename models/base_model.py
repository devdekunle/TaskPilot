#!/usr/bin/python3
"""
base models for other models to inherit from
"""
import uuid
from datetime import datetime
import sqlalchemy
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String, DateTime

Base = declarative_base()
time = "%A, %d %B %Y %H:%M:%S.%f"

class BaseModel:
    """ base class for taskpilot models"""

    id = Column(String(60), primary_key=True)
    create_time = Column(DateTime, default=datetime.utcnow())
    update_time = Column(DateTime, default=datetime.utcnow())

    def __init__(self):
        self.id = str(uuid.uuid4())
        self.create_time = datetime.utcnow()
        self.update_time = datetime.utcnow()

    def __str__(self):
        """ print string representation of the objects"""

        return "[{}] ({}) {}".format(self.__class__.__name__, self.id, self.__dict__)

    def to_dict(self):
        """ return the dictionary(for api) representation of an object"""
        new_dict = self.__dict__.copy()
        new_dict["__class__"] = self.__class__.__name__
        # set time format for returned dictionary
        new_dict["create_time"] = new_dict["create_time"].strftime(time)
        new_dict["update_time"] = new_dict["update_time"].strftime(time)
        return new_dict

    def delete(self):
        models.storage.delete(self)
