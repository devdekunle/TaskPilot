#!/usr/bin/python3
"""
tests for user model
"""
import unittest
from models.user import User

class TestUser(unittest.TestCase):

    def test_jwt_encode(self):
        user = User(first_name="sam",
                    last_name='Ab', password='12345',
                    username="adekunle",
                    email_address="sa@gmail.com",
                    )

        user.save()
        auth_token = user.encode_token(user.id)
        self.assertTrue(isinstance(auth_token, bytes))

    def test_jwt_decode(self):
        user = User(first_name="samuel",
                    last_name='Adekunle', password='12345',
                    email_address="sammymore50@gmail.com",
                    username="devdekunle",
                    )

        user.save()
        auth_token = user.encode_token(user.id)
        self.assertTrue(user.decode_token(auth_token) == user.id)

