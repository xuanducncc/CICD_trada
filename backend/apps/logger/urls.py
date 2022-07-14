from django.urls import path, include
from .views import *
from django.conf.urls import url
from django.views.generic import RedirectView
from rest_framework_simplejwt import views as jwt_views
from rest_framework.routers import DefaultRouter
app_name = 'logger'

urlpatterns = [
    path('log/create/', create_activitylog , name = 'create-userlog'),
    path('log/labeleditem/', count_labeleditem, name='count-labeled-item'),
    path('log/workitem/', log_workitem, name='log-workitem'),
    path('member/<int:pk>/performance/', member_performance, name='member-performance'),
    path('projects/<int:pk>/performance/', project_performance, name='project-performance'),
    path('users/<int:pk>/performance/', user_performance, name='user-performance'),
    path('projects/<int:pk>/labeled/history/', history_labeled, name='history-labeled-item')
]