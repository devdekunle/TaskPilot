#!/usr/bin/python3

from models.base_model import BaseModel

my_model = BaseModel()
my_model.name = 'First TaskPilot Model'
print(my_model)
print()
my_model_json = my_model.to_dict()

new_instance = BaseModel(**my_model_json)

print(new_instance)
print(new_instance is my_model)
