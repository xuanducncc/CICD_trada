from numpy import append
from backend.apps.cms.models import Projects
from django.urls import path, include
from django.urls.resolvers import URLPattern
from . import views

from rest_framework import routers
from rest_framework import permissions
from .views import *

from django.views.generic import RedirectView
from rest_framework_simplejwt import views as jwt_views

app_name = 'annotator'

urlpatterns = [
    path('labeleditem/create/', create_labeleditem, name = 'create-labeleditem'),
   #path('workitem/<int:pk>/labeled/create/', create_workitemLabeled, name = 'create-workitemlabeled'),
    path('workitem/<int:pk>/labeled/update/', update_workitemLabeled, name = 'update-workitemlabeled'),
    path('workitem/<int:pk>/', workitem_labeled_detail, name = 'workitem-labeled-detail'),
    path('workitem/<int:pk>/skip/', skip_workitem, name = 'skip-workitem'),
    path('workitem/<int:pk>/submit/', submit_workitem, name = 'submit-workitem')
]