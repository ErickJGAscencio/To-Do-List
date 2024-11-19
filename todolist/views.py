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

from .models import Project, Task, Document, Comment
from .serializers import UserSerializer, ProjectSerializer, TaskSerializer, DocumentSerializer, CommentSerializer

from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
    
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

    user = User(username=username, email=email)
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
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields=['email']
    
    def get_queryset(self):
        queryset = super().get_queryset()        
        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.filter(
                Q(email__icontains=search_query)
            )
        return queryset

@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    @action(detail=False, methods=['get'])
    def by_user(self, request):
        user = request.user
        
        if user.is_authenticated:
            owned_projects = Project.objects.filter(user=user)
            shared_projects = Project.objects.filter(team_members=user)
            
            all_projects = owned_projects | shared_projects
            
            serializer = self.get_serializer(all_projects, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response({"error": "User not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)        

    @action(detail=False, methods=['post'])
    def create_project(self, request):
        project_name = request.data.get('project_name')
        description = request.data.get('description')
        due_date = request.data.get('due_date')
        user = request.user

        if not project_name or not description:
            return Response({"error": "Project name and description are required"}, status=status.HTTP_400_BAD_REQUEST)

        project = Project.objects.create(
            project_name=project_name,
            description=description,
            due_date=due_date,
            user=user
        )

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
        project_name = request.data.get('project_name')
        description = request.data.get('description')
        
        print(id_project)
        
        if id_project is None or id_project == '':
            return Response({"error": "id_project is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            project = Project.objects.get(id=id_project)
        except Project.DoesNotExist:
            return Response({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if project_name is None or project_name == '':
            return Response({"error": "Project name is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if description is None or description == '':
            return Response({"error": "Project description is required"}, status=status.HTTP_400_BAD_REQUEST)
        
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
            return Response(serializer.data, status=status.HTTP_200_OK)
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
        
        if not id_project:
            return Response({"error": "Project Id is required"}, status=status.HTTP_400_BAD_REQUEST)

        if not task_name:
            return Response({"error": "Task name is required"}, status=status.HTTP_400_BAD_REQUEST)
        
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
            subtask_description = subtask_data.get('description')

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
            task = Task.objects.get(id=id_task)
            task.delete()
        except Task.DoesNotExist:
            return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)     
    
        return Response({"success": "Deleted task"}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['put'])
    def update_task(self, request):
        # Obtener los datos del request
        id_task = request.data.get('id_task')
        updated_data = request.data
        
        if not id_task:
            return Response({"error": "id_task is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            task = Task.objects.get(id=id_task)
        except Task.DoesNotExist:
            return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)

        # Serializamos la tarea y actualizamos con los nuevos datos
        serializer = TaskSerializer(task, data=updated_data, partial=True)

        if serializer.is_valid():
            serializer.save()  # Guardamos los datos actualizados
            task_data = serializer.data
            return Response(task_data, status=status.HTTP_200_OK)
        else:
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
class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    
    @action(detail=False, methods=['get'])
    def by_project(self, request):
        id_project = request.query_params.get('id_project')
        if id_project is None:
            return Response({"error": "id_project is required"}, status=status.HTTP_400_BAD_REQUEST)

        document = Document.objects.filter(project=id_project)
        serializer = self.get_serializer(document, many=True)
        return Response(serializer.data)
    
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    
    @action(detail=False, methods=['get'])
    def by_project(self, request):
        id_project = request.query_params.get('id_project')
        if id_project is None:
            return Response({"error": "id_project is required"}, status=status.HTTP_400_BAD_REQUEST)

        comments = Comment.objects.filter(project=id_project)        
        serializer = CommentSerializer(comments, many=True)
        
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def create_comment(self, request):
        user = request.user
        id_project = request.data.get('id_project')
        comment = request.data.get('comment')

        if not id_project:
            return Response({"error": "Project Id is required"}, status=status.HTTP_400_BAD_REQUEST)

        if not comment:
            return Response({"error": "Comment is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            project = Project.objects.get(id=id_project)
        except Project.DoesNotExist:
            return Response({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)
        
        comment = Comment.objects.create(
            user=user,
            comment = comment,
            project = project
        )
            
        serializer = self.get_serializer(comment)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)