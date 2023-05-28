#!/usr/bin/python3
"""
set up email utility
"""

from flask_mail import Mail, Message
mail = Mail()


def email_verify(subject='', link=None, token='', sender='', recipients=[], text_body=''):
    """
    function to send messages to users
    """
    msg = Message(subject, sender, recipients)
    msg.body = text_body.format(link)
    mail.send(msg)
    response = {
        'status': 'Success',
        'message': 'mail successfully sent'
    }
    return response
