from rest_framework import serializers
from .models import Project, Task, SubTask

class ProjectSerializer(serializers.ModelSerializer):
  class Meta():
    model = Project
    fields = '__all__'

class TaskSerializer(serializers.ModelSerializer):
  class Meta():
    model = Task
    fields = '__all__'
    
class SubTaskSerializer(serializers.ModelSerializer):
  class Meta():
    model = SubTask
    fields = '__all__'