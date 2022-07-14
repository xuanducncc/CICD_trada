from backend.apps.cms.models import Projects
from django.urls import path, include
from django.urls.resolvers import URLPattern
from . import views

from rest_framework import routers
from rest_framework import permissions
from .views import *
from .queue import *
from django.views.generic import RedirectView
from rest_framework_simplejwt import views as jwt_views

app_name = "cms"

urlpatterns = [
   path('projects/create/', create_project, name = 'create-project'),
   path('projects/update/<int:pk>/', update_project, name = 'update-project'),
   path('projects/delete/<int:pk>/', delete_project, name = 'delete-project'),
   path('projects/list/', list_project, name = 'list-project'),
   path('projects/detail/<int:pk>/', detail_project, name = 'detail-projects'),
   path('projects/settings/', setting_project, name = 'setting-project'),
   path('projects/finish/<int:pk>/', finish_create_project, name = 'finish-create-project'),
   path('projects/list/annotation/', list_anno_project, name = 'list-annotation-project'),
   path('projects/<int:pk>/overview/', review_project, name='overview-project'),
   path('dataset/list/', list_dataset, name = 'list-dataset'),
   path('dataset/create/', create_dataset, name = 'create-dataset'),
   path('dataset/update/<int:pk>/', update_dataset, name = 'update-dataset'),
   path('dataset/delete/<int:pk>/', delete_dataset, name = 'delete-dataset'),
   path('dataset/<int:pk>/detail/',detail_dataset, name = 'detail-dataset'),
   path('projects/attachdataset/', attach , name='attach-dataset'),
   path('projects/detachdataset/', detach , name='detach-dataset'),   
   path('member/list/', list_member,name='list-member'),
   path('member/admininvite/',create_member,name='create-member'),
   path('member/adminaccept/', admin_accept_member, name='admin-accept-member'),
   path('member/memberjoin/', member_join_project,name='member-join-project'),
   path('member/memberlist/', member_list_project,name='member-list-project'),
   path('member/delete/<int:pk>/',delete_member, name='delete-member'),
   path('member/joinrequest/',join_request, name='member-join-request'),
   path('member/<int:pk>/requestlabel/', request_workitem, name='member-request-queue'),
   path('member/project/<int:pk>/', member_in_project, name='member-in-project'),
   path('users/myprojects/', my_projects, name = 'my-projects'),
   path('projects/queuedetail/<int:pk>/', queue_detail, name='queue-detail'),
   path('projects/queuelist/',queue_list, name='queue-list'),
   path('member/changerole/', member_change_role, name = 'member-change-role'),
   path('member/activation/', activation_member, name='activation-member'),
]
