from rest_framework import viewsets
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
    action,
)
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework import status

from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from .models import Project, Task, SubTask

from .serializers import ProjectSerializer, TaskSerializer, SubTaskSerializer

# Create your views here.

@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response(
            {"error": "Username and password are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = get_object_or_404(User, username=username)

    if not user.check_password(password):
        return Response(
            {"error": "Invalid password"}, status=status.HTTP_400_BAD_REQUEST
        )

    token, created = Token.objects.get_or_create(user=user)

    user_data = {
        "username": user.username,
        "email": user.email,
    }

    return Response({"token": token.key, "user": user_data}, status=status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")

    if not username or not password or not email:
        return Response(
            {"error": "Username, Password and Email are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {"error": "Username already exists"}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User(username=username)
    user.set_password(password)
    user.save()

    token = Token.objects.create(user=user)

    return Response({"token": token.key, "user": {"username": user.username}}, status=status.HTTP_200_OK)

@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user
    return Response(
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
        }
    )

@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    @action(detail=False, methods=['get'])
    def by_user(self, request):
        user_id = request.query_params.get('user_id')
        if user_id is None:
            return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        projects = Project.objects.filter(user=user_id)
        serializer = self.get_serializer(projects, many=True)

        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def create_project(self, request):
        project_name = request.data.get('project_name')
        description = request.data.get('description')
        user = request.user
        tasks_data = request.data.get('tasks', [])

        if not project_name or not description:
            return Response({"error": "Project name and description are required"}, status=status.HTTP_400_BAD_REQUEST)

        project = Project.objects.create(
            project_name=project_name,
            description=description,
            user=user
        )

        created_tasks = []
        for task_data in tasks_data:
            task_name = task_data.get('task_name')
            task_description = task_data.get('description', '')
            
            if task_name:
                task = Task.objects.create(
                    project=project,
                    task_name=task_name,
                    description=task_description
                )
                created_tasks.append(task)

        serializer = self.get_serializer(project)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['delete'])
    def delete_project(self, request):
        id_project = request.query_params.get('id_project')
        if not id_project:
            return Response({"error": "id_project is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            project = Project.objects.get(id=id_project)
            # TODAS LAS TAREAS RELACIONADAS AL PROYECTO SERÁN ELIMINADAS POR LA DECLARACION "on_delete=models.CASCADE" EN EL MODELO
            project.delete()
        except Project.DoesNotExist:
            return Response({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)

        return Response({"success": "Deleted project"}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['put'])
    def update_project(self, request):
        id_project = request.data.get('id_project')
        if id_project is None:
            return Response({"error": "id_project is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            project = Project.objects.get(id=id_project)
        except Project.DoesNotExist:
            return Response({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)
        
        incoming_tasks_data = request.data.get('tasks', [])
        if incoming_tasks_data:
            current_tasks = list(project.task_set.all())

            incoming_task_ids = [task['id'] for task in incoming_tasks_data if 'id' in task]

            for task in current_tasks:
                if task.id not in incoming_task_ids:
                    task.delete() 

            for task_data in incoming_tasks_data:
                if 'id' not in task_data:
                    Task.objects.create(
                        project=project,
                        task_name=task_data,
                        description="..."
                    )
                
        serializer = self.get_serializer(project, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @property
    def progress(self):
        total_tasks = self.task_set.count()
        completed_tasks = self.task_set.filter(is_completed=True).count()

        if total_tasks == 0:
            # Si no hay subtareas, se verifica si la tarea está marcada como completada
            return 100 if self.is_completed else 0

        return (completed_tasks / total_tasks) * 100

@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    @action(detail=False, methods=['get'])
    def by_project(self, request):
        id_project = request.query_params.get('id_project')
        if id_project is None:
            return Response({"error": "id_project is required"}, status=status.HTTP_400_BAD_REQUEST)

        tasks = Task.objects.filter(project=id_project)
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data)

    @action(detail=False , methods=['post'])
    def create_task(self, request):
        task_name = request.data.get('task_name')
        description = request.data.get('description')
        id_project = request.data.get('id_project')
        subtasks_data = request.data.get('subtasks', [])

        if not task_name or not description:
            return Response({"error": "Task name and description are required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            project = Project.objects.get(id=id_project)
        except Project.DoesNotExist:
            return Response({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)

        task = Task.objects.create(
            task_name = task_name,
            description = description,
            project = project
        )

        created_subtasks = []

        for subtask_data in subtasks_data:
            subtask_name = subtask_data.get('subtask_name')
            subtask_description = subtask_data.get('description', '')

            if subtask_name:
                subtask = SubTask.objects.create(
                    task = task,
                    subtask_name = subtask_name,
                    description = subtask_description
                )
                created_subtasks.append(subtask)
            
        serializer = self.get_serializer(task)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['delete'])
    def delete_task(self, request):
        id_task = request.query_params.get('id_task')
        if id_task is None:
            return Response({"error": "id_task is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            task = Task.objects.filter(id=id_task)
            task.delete()
        except Task.DoesNotExist:
            return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)

        return Response({"success": f"Deleted task"}, status=status.HTTP_204_NO_CONTENT)        
    
    @action(detail=False, methods=['put'])
    def update_task(self, request):
        id_task = request.data.get('id_task')
        
        if id_task is None:
            return Response({"error": "id_task is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            task = Task.objects.get(id=id_task)
        except Task.DoesNotExist:
            return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)
        
        incoming_subtasks_data = request.data.get('subtasks', [])
        if incoming_subtasks_data:
            current_subtasks = list(task.subtask_set.all())

            incoming_subtask_ids = [subtask['id'] for subtask in incoming_subtasks_data if 'id' in subtask]

            for subtask in current_subtasks:
                if subtask.id not in incoming_subtask_ids:
                    subtask.delete()  # Eliminar la subtarea de la db

            # Agregar nuevas subtareas
            for subtask_data in incoming_subtasks_data:
                if 'id' not in subtask_data:
                    SubTask.objects.create(
                        task=task,
                        subtask_name=subtask_data
                    )

        serializer = self.get_serializer(task, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()

            task_data = serializer.data
            
            subtasks_data = SubTaskSerializer(task.subtask_set.all(), many=True).data

            task_data['subtasks'] = subtasks_data

            return Response(task_data, status=status.HTTP_200_OK)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @property
    def progress(self):
        total_subtasks = self.subtask_set.count()
        completed_subtasks = self.subtask_set.filter(is_completed=True).count()

        if total_subtasks == 0:
            # Si no hay subtareas, se verifica si la tarea está marcada como completada
            return 100 if self.is_completed else 0

        return (completed_subtasks / total_subtasks) * 100

@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
class SubTaskViewSet(viewsets.ModelViewSet):
    queryset = SubTask.objects.all()
    serializer_class = SubTaskSerializer

    @action(detail=False, methods=['get'])
    def by_task(self, request):
        id_task = request.query_params.get('id_task')
        if id_task is None:
            return Response({"error": "id_task is required"}, status=status.HTTP_400_BAD_REQUEST)

        subtasks = SubTask.objects.filter(task=id_task)
        serializer = self.get_serializer(subtasks, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['delete'])
    def delete_subtask(self, request):
        id_subtask = request.query_params.get('id_subtask')
        if id_subtask is None:
            return Response({"error": "id_subtask is required"}, status=status.HTTP_400_BAD_REQUEST)

        subtask = SubTask.objects.filter(id=id_subtask)
        subtask.delete()
        
        return Response({"success": f"Deleted subtask"}, status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=False, methods=['put'])
    def update_subtask(self, request):
        id_subtask = request.data.get('id_subtask')
        
        if id_subtask is None:
            return Response({"error": "id_subtask is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            subtask = SubTask.objects.get(id=id_subtask)
        except SubTask.DoesNotExist:
            return Response({"error": "SubTask not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(subtask, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)