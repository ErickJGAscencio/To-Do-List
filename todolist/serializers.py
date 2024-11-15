from rest_framework import serializers
from .models import Project, Task, Document, Comment
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User    
    # fields = ['id', 'username'] 
    fields = ['id', 'username', 'email']
    # fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):
  team_members = UserSerializer(many=True, read_only=True)
  
  class Meta:
    model = Project
    fields = '__all__'
        
class TaskSerializer(serializers.ModelSerializer):
  class Meta():
    model = Task
    fields = '__all__'
    
class DocumentSerializer(serializers.ModelSerializer):
  class Meta():
    model = Document
    fields = '__all__'
    
class CommentSerializer(serializers.ModelSerializer):
  user = serializers.SerializerMethodField()
  class Meta:
    model = Comment
    fields = '__all__'
  # Método para obtener el username en lugar del ID
  def get_user(self, obj):
    return obj.user.username