#!/usr/bin/python3
''' test user class '''
from models import storage
from models.user import User
from models.project_user import ProjectUser
from models.task_user import TaskUser
from models.subtask_user import SubTaskUser
from models.project import Project
from models.task import Task
from models.subtask_comment import SubTaskComment
from models.sub_task import SubTask
from models.project_comment import ProjectComment
from models.task_comment import TaskComment


# create new user
new_user = User(first_name="Chiamaka", last_name="Izukanne", email_address="ci@gmail.com", password="12345", username="chibaby")
new_user.save()

# create new project
new_project = Project(title="Start online shopping Biz")
new_project.save()


#create association table

p_u = ProjectUser(user_id=new_user.id, project_id=new_project.id, member_role='admin')
# create new task
new_task = Task(title="Procure online space", project_id=new_project.id)

new_task.save()

#create task user
t_u = TaskUser(task_id=new_task.id, user_id=new_user.id, member_role='team-lead')
# create new sub_task
new_sub_task = SubTask(title="Make payments in two days", task_id=new_task.id)

new_sub_task.save()

s_u = SubTaskUser(subtask_id=new_sub_task.id, user_id=new_user.id)
#create comment
new_project_comment = ProjectComment(text="I am the Project manager of this project", user_id=new_user.id, project_id=new_project.id)

new_project_comment.save()

# create task_comment
new_task_comment = TaskComment(text="i will now assign memners to each team", task_id=new_task.id, user_id=new_user.id)

new_task_comment.save()

# add project, task, subtask and comments to user
new_user.projects.append(p_u)
new_user.tasks.append(t_u)
new_user.subtasks.append(s_u)


if p_u not in new_project.members:
    new_project.members.append(p_u)
if t_u not in new_task.members:
    new_task.members.append(t_u)
if s_u not in new_sub_task.members:
    new_sub_task.members.append(s_u)


if new_project_comment not in new_user.project_comments:
    new_user.project_comments.append(new_project_comment)
if new_task_comment not in new_user.task_comments:
    new_user.task_comments.append(new_task_comment)

storage.save()
print("OK")
print()
print("dictionary representation")
print(new_user.to_dict())
print()

print("projects the user is a part of")
print([project.project.to_dict() for project in new_user.projects])
print()

print("user role")

print([i.member_role for i in new_user.projects])

print("tasks the user is a part of")
print([task.task.to_dict() for task in new_user.tasks])
print()
print()
print("User comments on a project")
print([i.text for i in new_user.project_comments])
print()
print([comment.text for comment in new_user.task_comments])

