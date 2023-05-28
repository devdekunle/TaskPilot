#!/usr/bin/python3
"""
test for authentication
"""
from models import storage
from models.user import User
import unittest
import requests

class TestAuthBlueprint(unittest.TestCase):

    def test_registration(self):
        data =  {
           'first_name': 'ab',
           'last_name': 'kyle',
           'password': '23423',
           'username': 'kyleab',
           'email_address': 'abrahamadekunle50@gmail.com'
        }
        url = '0.0.0.0:5000/auth/register'

        response = requests.post(url, data)
        print(response.json())
        data = json.loads(response.data.decode())
        self.assertTrue(data['status'] == 'success')
        self.assertTrue(data['message'] == 'Registration successful')
        self.assertTrue(data['auth_token'])
        self.assertTrue(response.content_type == 'application/json')
        self.assertTrue(response.status_code, 201)
