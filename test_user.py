#!/usr/bin/python3
''' test user class '''
from models import storage
from models.user import User
from models.project import Project
from models.task import Task
# from models.subtask_comment import SubTasKComment
from models.sub_task import SubTask
from models.project_comment import ProjectComment
from models.task_comment import TaskComment


# create new user
new_user = User(first_name="Chiamaka", last_name="Izukanne", email_address="ci@gmail.com")
new_user.save()

# create new project
new_project = Project(title="Start online shopping Biz")
new_project.save()
# create new task
new_task = Task(title="Procure online space", project_id=new_project.id)

new_task.save()
# create new sub_task
new_sub_task = SubTask(title="Make payments in two days", task_id=new_task.id)

new_sub_task.save()

#create comment
new_project_comment = ProjectComment(text="I am the Project manager of this project", user_id=new_user.id, project_id=new_project.id)

new_project_comment.save()

# create task_comment
new_task_comment = TaskComment(text="i will now assign memners to each team", task_id=new_task.id, user_id=new_user.id)

new_task_comment.save()

# add project, task, subtask and comments to user
new_user.projects.append(new_project)
new_user.tasks.append(new_task)
new_user.sub_tasks.append(new_sub_task)

if new_project_comment not in new_user.project_comments:
    new_user.project_comments.append(new_project_comment)
if new_task_comment not in new_user.task_comments:
    new_user.task_comments.append(new_task_comment)

storage.save()
print("OK")

print()

print("string representation of new_user object")
print(new_user)

print()
print("dictionary representation")
print(new_user.to_dict())

print("projects user is involved in")
print([user_project.title for user_project in new_user.projects])
print()
print("tasks of a project assigned to a user")
print([user_tasks.title for user_tasks in new_user.tasks])
print()
print("User comments on a project")
print([i.text for i in new_user.project_comments])
print()
print([comment.text for comment in new_user.task_comments])
