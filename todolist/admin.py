from django.contrib import admin
from .models import Project, Task, Document, Comment, Notification, NotificationType

# Register your models here.
admin.site.register(Project)
admin.site.register(Task)
admin.site.register(Document)
admin.site.register(Comment)
admin.site.register(Notification)
admin.site.register(NotificationType)