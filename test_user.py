#!/usr/bin/python3
''' test user class '''
from models.user import User


new_user = User()

new_user.first_name = "Samuel"
new_user.last_name = "Abraham"
new_user.email_address = "sammymore50@gmail.com"
print(new_user)

print()

print(new_user.to_dict())

