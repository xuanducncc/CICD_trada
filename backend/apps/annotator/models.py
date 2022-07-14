from enum import Enum
import re
import os
from django.db import models
from django.conf import settings
from django.db.models.base import Model
from rest_framework.exceptions import bad_request
from backend.apps.authentication.models import User
from backend.apps.cms.models import *
from backend.apps.editor.models import *
from backend.apps.distributor.models import *
from django.core.validators import MinValueValidator, MaxValueValidator

class LabeledItem(models.Model):
    workitem = models.ForeignKey(WorkItem, on_delete=models.CASCADE)
    label = models.ForeignKey(Label, null=True, blank=True ,on_delete=models.CASCADE)
    tool = models.ForeignKey(Tool, null=True, blank=True, on_delete=models.CASCADE)
    index = models.IntegerField()
    toolType = models.CharField(max_length=64, choices=TypeToolChoice.choices(),
                    default=TypeToolChoice.CLASSIFICATION)
    controlType = models.CharField(max_length=64, choices=TypeControlTool.choices(),
                    default=TypeControlTool.BOUNDING_BOX)
    labelCode = models.CharField(max_length=128, null=True, blank=True)
    labelName = models.CharField(max_length=128, null=True, blank=True)
    labelValue = models.JSONField()
    color = models.CharField(max_length=64, null=True, blank=True)
    trust_score = models.IntegerField(default=0)