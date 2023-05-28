#!/usr/bin/python3

from models.user import User

user_1 = User(first_name="Timileyin", last_name="Adekunle", password="1234", email_address="sammymo@gmail.com")

user_1.save()

print(user_1.to_dict())
