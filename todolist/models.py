from django.db import models
from django.contrib.auth.models import User
# Create your models here.
class Project(models.Model):
  user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_projects')  # Dueño del proyecto
  team_members = models.ManyToManyField(User, related_name='shared_projects', blank=True)  # Usuarios con acceso  
  project_name = models.CharField(max_length=50)
  description = models.CharField(max_length=200)
  progress = models.DecimalField(max_digits=5, decimal_places=2, default= 0.0)
  is_completed = models.BooleanField(default=False)
  due_date = models.DateField(null=True, blank=True)
    
  def __str__(self):
    return self.project_name

class Task(models.Model):
  task_name = models.CharField(max_length=50)
  description = models.CharField(max_length=200)
  progress = models.DecimalField(max_digits=5, decimal_places=2, default= 0.0)
  is_completed = models.BooleanField(default=False)
  due_date = models.DateField(null=True, blank=True)
  assign_to = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE)
  project = models.ForeignKey(Project, on_delete=models.CASCADE)

  def __str__(self):
    return self.task_name
    
class NotificationType(models.Model):
  identifier = models.CharField(max_length=50, unique=True) 
  name = models.CharField(max_length=100)
  description = models.TextField(blank=True, null=True) 
    
  def __str__(self):
    return self.name

class Notification(models.Model):
  user = models.ForeignKey(User, on_delete=models.CASCADE)
  task_description = models.CharField(max_length=100)
  notification_type = models.ForeignKey(NotificationType, on_delete=models.CASCADE)
  is_read = models.BooleanField(default=False)
  
  def __str__(self):
    return self.user.username
  
class Document(models.Model):
  project = models.ForeignKey(Project, on_delete=models.CASCADE)
  file = models.FileField(upload_to='documents/')
    
  def __str__(self):
    return self.file.name
  
class Comment(models.Model):
  project = models.ForeignKey(Project, on_delete=models.CASCADE)
  user = models.ForeignKey(User, on_delete=models.CASCADE)
  comment = models.CharField(max_length=100)
    
  def __str__(self):
    return self.user.username