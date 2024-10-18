from django.urls import path, include
from rest_framework.documentation import include_docs_urls
from rest_framework.routers import DefaultRouter
from todolist import views

router = DefaultRouter()
router.register(r'projects', views.ProjectViewSet)
router.register(r'tasks', views.TaskViewSet)
router.register(r'subtasks', views.SubTaskViewSet)

urlpatterns = [
  path('', include(router.urls)),
  path('api/v1/', include(router.urls)),
  
  path("login/", views.login, name='login'),
  path("register/", views.register, name='register'),
  path("profile/", views.profile, name='profile'),
  path('me/', views.profile, name='user-profile'),

  path('docs/', include_docs_urls(title='WorkCloud Documentation')),
]