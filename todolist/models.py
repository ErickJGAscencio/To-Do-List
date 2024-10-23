from django.db import models
from django.contrib.auth.models import User
# Create your models here.
class Project(models.Model):
  user = models.ForeignKey(User, on_delete=models.CASCADE)
  project_name = models.CharField(max_length=50)
  description = models.CharField(max_length=200)
  progress = models.DecimalField(max_digits=5, decimal_places=2, default= 0.0)
  is_completed = models.BooleanField(default=False)
  color = models.CharField(max_length=7, default='#9b9b9b')
    
  def __str__(self):
    return self.project_name
    
  # @property
  # def progress(self):
  #   total_tasks = self.task_set.count()
  #   completed_task = self.task_set.filter(is_completed=True).count()
    
  #   if total_tasks == 0:
  #     return 100 if self.is_completed else 0

  #   return (completed_task / total_tasks) * 100

class Task(models.Model):
  project = models.ForeignKey(Project, on_delete=models.CASCADE)
  task_name = models.CharField(max_length=50)
  description = models.CharField(max_length=200) 
  progress = models.DecimalField(max_digits=5, decimal_places=2, default= 0.0)
  is_completed = models.BooleanField(default=False)
  color = models.CharField(max_length=7, default='#9b9b9b')

  def __str__(self):
    return self.task_name

  # @property
  # def progress(self):
  #   total_subtasks = self.subtask_set.count()
  #   completed_subtasks = self.subtask_set.filter(is_completed=True).count()
    
  #   if total_subtasks == 0:
  #     return 100 if self.is_completed else 0

  #   return (completed_subtasks / total_subtasks) * 100


class SubTask(models.Model):
  task = models.ForeignKey(Task, on_delete=models.CASCADE)
  subtask_name = models.CharField(max_length=50)
  description = models.CharField(max_length=200, blank=True, null=True) 
  is_completed = models.BooleanField(default=False)
  
  def __str__(self):
    return self.subtask_name