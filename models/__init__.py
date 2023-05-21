#!/usr/bin/python3

"""initialize the models package"""
from models.engine.db_storage import DataStorage

storage = DataStorage()

storage.reload()

