#!/usr/bin/python3
"""
test the project class
"""
from models import storage
from models.project import Project
from models.sub_task import SubTask
from models.user import User
from models.task import Task
from models.subtask_comment import SubTaskComment
from models.project_comment import ProjectComment
from models.task_comment import TaskComment


# create a new project
project_1 = Project(title='Solar Farm Establishment')
project_1.save()

# create new users
user_1 = User(first_name='Olamide', last_name='Cloobtech', email_address='belkid98@gmail.com', user_role="admin")
user_1.save()

user_2 = User(first_name='Adekunle', last_name='Abraham', email_address='sammymore50@gmail.com', user_role="member")
user_2.save()
user_3 = User(first_name='Ijegwa', last_name="Sunday", email_address='ijegsbaba@gmail.com', user_role="member")
user_3.save()

# create new task
task_1 = Task(title="Land procurement", project_id=project_1.id)
task_1.save()

task_2 = Task(title="Solar panel purchase", project_id=project_1.id)
task_2.save()

# create comment for project
comment_1 = ProjectComment(text='We will secure the land documentations and proceed', user_id=user_2.id, project_id=project_1.id)
comment_1.save()

# link project_1 to users and tasks


project_1.members.append(user_1)
project_1.members.append(user_2)
project_1.members.append(user_3)
if task_1 not in project_1.tasks:
    project_1.tasks.append(task_1)
if task_2 not in project_1.tasks:
    project_1.tasks.append(task_2)
if comment_1 not in project_1.comments:
    project_1.comments.append(comment_1)

storage.save()

print([member.to_dict() for member in project_1.members])
print()
print([(comment.text) for comment in project_1.comments])

print([task.to_dict() for task in project_1.tasks])
