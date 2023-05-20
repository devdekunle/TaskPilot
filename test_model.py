#!/usr/bin/python3

from models.base_model import BaseModel

my_model = BaseModel()
my_model.name = 'First TaskPilot Model'
print(my_model)
print()
print(my_model.to_dict())

my_model_json = my_model.to_dict()
print("JSON representation of my_model")
for key in my_model_json.keys():
    print("\t{}: [{}] - {}".format(key, type(my_model_json[key]), my_model_json[key]))
