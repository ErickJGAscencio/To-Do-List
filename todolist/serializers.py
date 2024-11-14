from rest_framework import serializers
from .models import Project, Task, Document, Comment

class ProjectSerializer(serializers.ModelSerializer):
  class Meta():
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