from os import name
from backend.apps.cms.models import Projects
from django.urls import path, include
from django.urls.resolvers import URLPattern
from . import views
from rest_framework import routers
from rest_framework import permissions
from .views import *

from django.views.generic import RedirectView
from rest_framework_simplejwt import views as jwt_views

app_name = "exporter"

urlpatterns = [
    path('projects/<int:pk>/export/', export_project, name='export-project')
]