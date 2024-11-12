from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from .models import Project, Task

# Create your tests here.
class UserTests(APITestCase):
  def setUp(self):#Preparacion del objeto
    self.user = User.objects.create_user(username='testuser', password='password123')
    self.token = Token.objects.create(user=self.user)
    self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
    
  def test_login_success(self):
    url = '/login/'
    data = {
      'username': 'testuser', 
      'password': 'password123'
      }
    response = self.client.post(url, data, format='json')
    
    print('Response Data (login):', response.data)
    
    self.assertEqual(response.status_code, status.HTTP_200_OK) #Inidicamos que status esperamos(el que obtenemos, el que esperamos)
    self.assertIn('token', response.data)
    
  def test_login_invalid_password(self):
    url = '/login/'
    data = {
      'username': 'testuser', 
      'password': 'password123456'
      }
    response = self.client.post(url, data, format='json')

    print('Response Data (login-wrong-pass):', response.data)
    
    self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    self.assertIn('error', response.data)
  
  def test_register_user(self):
    url = '/register/'
    data = {
      'username': 'newuser',
      'email': 'newuser@example.com',
      'password': 'newpassword123'
      }
    response = self.client.post(url, data, format='json')
    
    print('Response Data (register):', response.data)
    
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertIn('token', response.data)
  
  def test_register_user_invalid_username(self):
    url = '/register/'
    data = {
      'username': '',
      'email': 'newuser@example.com',
      'password': '123123'
    }
    response = self.client.post(url, data, format='json')
    
    print('Response Data (register-invalid-username):', response.data)
    
    self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    self.assertIn('error', response.data)
  
  def test_register_user_invalid_password(self):
    url = '/register/'
    data = {
      'username': 'newuser',
      'email': 'newuser@example.com',
      'password': ''
    }
    response = self.client.post(url, data, format='json')
    
    print('Response Data (register-invalid-pass):', response.data)
    
    self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    self.assertIn('error', response.data)
  
  def test_register_user_invalid_mail(self):
    url = '/register/'
    data = {
      'username': 'newuser',
      'email': '',
      'password': '123123'
    }
    response = self.client.post(url, data, format='json')
    
    print('Response Data (register-invalid-mail):', response.data)
    
    self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    self.assertIn('error', response.data)

  def test_profile_user(self):
    url = '/profile/'
    response = self.client.get(url)
    
    print('Response Data (profile):', response.data)
    
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertIn('username', response.data)

class ProjectTests(APITestCase):
  def setUp(self):
    self.user = User.objects.create_user(username='testuser', password='password123')
    self.token = Token.objects.create(user=self.user)
    self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

  def test_create_project_success(self):
    url = '/projects/create_project/' 
    data = {
        'project_name': 'New Project',
        'description': 'A test project',
        'user': self.user.id
    }
    
    response = self.client.post(url, data, format='json')
        
    print(f"Response Data (Create Project Success): {response.data}")
    
    self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    self.assertEqual(Project.objects.count(), 1)

  def test_create_project_no_name(self):
    url = '/projects/create_project/' 
    data = {
        'project_name': '',
        'description': 'A test project',
        'user': self.user.id
    }
    
    response = self.client.post(url, data, format='json')
        
    print(f"Response Data (Create Project No Name): {response.data}")
    
    self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    self.assertEqual(Project.objects.count(), 0)

  def test_create_project_no_description(self):
    url = '/projects/create_project/' 
    data = {
        'project_name': '',
        'description': 'A test project',
        'user': self.user.id
    }
    
    response = self.client.post(url, data, format='json')
        
    print(f"Response Data (Create Project No Description): {response.data}")
    
    self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    self.assertEqual(Project.objects.count(), 0)
    
  def test_delete_project_success(self):
    project = Project.objects.create(project_name='Project to delete', description='Will be deleted', user=self.user)    
    url = f'/projects/delete_project/?id_project={project.id}'    
    response = self.client.delete(url)
    
    print(f"Response Data (Delete Project Success): {response.data}")
    print(f"Remaining Projects: {Project.objects.count()}")
    
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(Project.objects.count(), 0)

  def test_delete_project_failure(self):
    project = Project.objects.create(project_name='Project to delete', description='Will be deleted', user=self.user)    
    url = f'/projects/delete_project/?id_project=2'    
    response = self.client.delete(url)
    
    print(f"Response Data (Delete Project Failure): {response.data}")
    print(f"Remaining Projects: {Project.objects.count()}")
    
    self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    self.assertEqual(Project.objects.count(), 1)

class TaskTests(APITestCase):
  def setUp(self):    
    self.user = User.objects.create_user(username='testuser', password='password123')
    self.token = Token.objects.create(user=self.user)
    self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
    
    self.project = Project.objects.create(
      project_name='Test Project',
      description='A test project',
      user=self.user
    )    
    
  def test_create_task_success(self):
    url = '/tasks/create_task/' 
    data = {
        'task_name': 'New Task',
        'description': 'A test task',
        'id_project': self.project.id
    }  
      
    response = self.client.post(url, data, format='json')
        
    print(f"Response Data (Create Task Success): {response.data}")
    
    self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    self.assertEqual(Project.objects.count(), 1)
    self.assertEqual(Task.objects.count(), 1)
    
  def test_create_task_no_name(self):
    url = '/tasks/create_task/' 
    data = {
        'task_name': '',
        'description': 'A test task',
        'id_project': self.project.id
    }
    
    response = self.client.post(url, data, format='json')
        
    print(f"Response Data (Create Task No Name): {response.data}")
    
    self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    self.assertEqual(Project.objects.count(), 1)
    self.assertEqual(Task.objects.count(), 0)
    
  def test_create_task_no_description(self):
    url = '/tasks/create_task/' 
    data = {
        'task_name': 'New Task',
        'description': '',
        'id_project': self.project.id
    }
    
    response = self.client.post(url, data, format='json')
        
    print(f"Response Data (Create Task No Description): {response.data}")
    
    self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    self.assertEqual(Project.objects.count(), 1)
    self.assertEqual(Task.objects.count(), 1)
   
  def test_create_task_no_id(self):
    url='/tasks/create_task/'
    data={
      'task_name': 'New Task',
      'description': 'A test task',
      'id_project': ''
    }
    response = self.client.post(url, data, format='json')
    
    print(f"Response Data (Create Task No Id): {response.data}")
    
    self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    self.assertEqual(Project.objects.count(), 1)
    self.assertEqual(Task.objects.count(), 0)

  def test_create_task_no_found_project(self):
    url='/tasks/create_task/'
    data={
      'task_name': 'New Task',
      'description': 'A test task',
      'id_project': '150'
    }
    response = self.client.post(url, data, format='json')
    
    print(f"Response Data (Create Task No Found Project): {response.data}")
    
    self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    self.assertEqual(Project.objects.count(), 1)
    self.assertEqual(Task.objects.count(), 0)

  def test_delete_task_success(self):
    task = Task.objects.create(task_name='Task to delete', description='Will be deleted', project=self.project)    
    url = f'/tasks/delete_task/?id_task={task.id}'    
    response = self.client.delete(url)
    
    print(f"Response Data (Delete Task Success): {response.data}")
    print(f"Remaining Tasks: {Task.objects.count()}")
    
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(Task.objects.count(), 0)
    
  def test_delete_task_failure(self):
    task = Task.objects.create(task_name='Task to delete', description='Will be deleted', project=self.project)    
    url = f'/tasks/delete_task/?id_task=100'    
    response = self.client.delete(url)
    
    print(f"Response Data (Delete Task Failure): {response.data}")
    print(f"Remaining Tasks: {Task.objects.count()}")
    
    self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    self.assertEqual(Task.objects.count(), 1)