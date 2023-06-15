#!/usr/bin/python3
"""
set up email utility
"""

from flask_mail import Mail, Message
mail = Mail()


def send_mail(subject=None, link=None, sender=None, recipients=[], text_body=None):
    """
    function to send messages to users
    """
    msg = Message(subject, sender=sender, recipients=recipients)
    msg.body = text_body.format(link)
    mail.send(msg)
    response = {
        'status': 'Success',
        'message': 'Mail successfully sent'
    }
    return response
