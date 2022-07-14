from .views import *
from django.urls import path, include

app_name = "validator"

urlpatterns = [
    path('workitem/verify/', action_workitem, name="action-workitem"),
    path('workitem/labelvote/', verifybox_workitem, name="verify-box-work-item"),
    path('member/<int:pk>/requestreview/', get_review, name="get-review"),
]