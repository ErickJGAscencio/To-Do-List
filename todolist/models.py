from django.db import models
from django.contrib.auth.models import User
# Create your models here.
class Project(models.Model):
  project_name = models.CharField(max_length=50)
  description = models.CharField(max_length=200)
  color = models.TextField(blank=True, null=True)
  user = models.ForeignKey(User, on_delete=models.CASCADE)
  is_completed = models.BooleanField(default=False)
    
  def __str__(self):
    return self.project_name

class Task(models.Model):
  task_name = models.CharField(max_length=50)
  description = models.CharField(max_length=200) 
  color = models.TextField(blank=True, null=True)
  project = models.ForeignKey(Project, on_delete=models.CASCADE)
  is_completed = models.BooleanField(default=False)

  def __str__(self):
    return self.task_name

  @property
  def progress(self):
    total_subtasks = self.subtask_set.count()
    completed_subtasks = self.subtask_set.filter(is_completed=True).count()
    
    if total_subtasks == 0:
      return 100 if self.is_completed else 0

    return (completed_subtasks / total_subtasks) * 100


class SubTask(models.Model):
  subtask_name = models.CharField(max_length=50)
  description = models.CharField(max_length=200, blank=True, null=True) 
  task = models.ForeignKey(Task, on_delete=models.CASCADE)
  is_completed = models.BooleanField(default=False)
  
  def __str__(self):
    return self.subtask_name