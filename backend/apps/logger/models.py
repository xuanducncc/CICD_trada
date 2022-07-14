from backend.apps.editor.models import Label
from django.db import models
from backend.apps.cms.models import *
from backend.apps.distributor.models import *
from backend.apps.authentication.models import *
from backend.apps.annotator.models import *
from django.db import models
from enum import Enum
from django.utils import timezone
class ActionLog(str, Enum):
    SUBMITED  = 'SUBMITED'
    SKIPPED = 'SKIPPED'
    JOIN = 'JOIN'
    DATASET = 'DATASET'

    @classmethod
    def choices(cls):
        return tuple((x.value,x.name) for x in cls)
    
    def __str__(self):
        return self.value

class ObjectLog(str, Enum):
    LABELED = 'LABELED'
    LOGIN = 'LOGIN'
    MEMBER = 'MEMBER'
    PROJECT = 'PROJECT'
    WORKITEM = 'WORKITEM'

    @classmethod
    def choices(cls):
        return tuple((x.value,x.name) for x in cls)
    
    def __str__(self):
        return self.value

class ActivityLog(models.Model):
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE)
    project = models.ForeignKey(Projects, null=True, blank=True, on_delete=models.CASCADE)
    member = models.ForeignKey(Member, null=True, blank=True, on_delete=models.CASCADE)
    workitem = models.ForeignKey(WorkItem, null=True, blank=True, on_delete=models.CASCADE)
    label = models.ForeignKey(Label, null=True, blank=True, on_delete=models.CASCADE)
    labeleditem = models.ForeignKey(LabeledItem, null=True, blank=True, on_delete=models.CASCADE)
    tool = models.ForeignKey(Tool, null=True, blank=True, on_delete=models.CASCADE)
    action_time = models.DateTimeField(auto_now_add=True, blank=True)
    object = models.CharField(max_length=64, choices=ObjectLog.choices())
    action = models.CharField(max_length=64, choices=ActionLog.choices())
    change_message = models.CharField(max_length=256)
    value = models.JSONField(null=True, blank=True)
