from backend.apps.cms.models import Projects
from django.urls import path, include
from django.urls.resolvers import URLPattern
from . import views

from rest_framework import routers
from rest_framework import permissions
from .views import *

from django.views.generic import RedirectView
from rest_framework_simplejwt import views as jwt_views
from django.conf.urls.static import static
app_name = 'editor'

urlpatterns = [
    path('editor/create/', create_editor, name = 'create-editor'),
    path('editor/update/<int:pk>/', update_editor, name = 'update-editor'),
    path('projects/<int:pk>/editor/', project_editor_list, name = 'project-editor-list'),
    path('tool/create/', create_tool, name = 'create-tool'),
    path('tool/update/<int:pk>/', update_tool, name = 'update-tool'),
    path('workitem/queue/', list_queue, name = 'workitem-list-queue'),
    path('projects/instructions/create/', create_instructions, name = 'create-instructions'),
    path('projects/<int:pk>/instructions/list/', list_instructions, name = 'list-instructions'),
    path('projects/instructions/attachment/<int:pk>/', attachment_instructions, name = 'attachment-instructions')
]