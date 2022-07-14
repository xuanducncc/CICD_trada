from enum import Enum
import re
import os
from django.db import models
from django.conf import settings
from django.db.models.base import Model
from django.db.models.fields import CharField
from numpy import bartlett
from backend.apps.authentication.models import User
from backend.apps.cms.models import *
from django.core.validators import MinValueValidator, MaxValueValidator

class TypeEditorChoice(str, Enum):
    IMAGE = 'image'
    AUDIO = 'audio'

    @classmethod
    def choices(cls):
        return tuple((x.value, x.name) for x in cls)
    
    def __str__(self):
        return self.value

class Editor(models.Model):
    project = models.ForeignKey(Projects, null=True, blank=True,
                on_delete=models.SET_NULL, related_name='+')
    type = models.CharField(max_length=64, choices=TypeEditorChoice.choices(),
                default=TypeEditorChoice.IMAGE)

class TypeToolChoice(str, Enum):
    CLASSIFICATION = 'CLASSIFICATION'
    DETECTION = 'DETECTION'

    @classmethod
    def choices(cls):
        return tuple((x.value, x.name) for x in cls)
    
    def __str__(self):
        return self.value

class Tool(models.Model):
    editor = models.ForeignKey(Editor, on_delete=models.CASCADE)
    name = models.CharField(max_length=128, null=True, blank=True)
    description = models.CharField(max_length=2048,null=True, blank=True)
    type = models.CharField(max_length=64, choices=TypeToolChoice.choices(),
                default=TypeToolChoice.CLASSIFICATION)
    
class Instruction(models.Model):
    project = models.ForeignKey(Projects, on_delete=models.CASCADE, related_name='+')
    title = models.CharField(null=True, blank=True, max_length=128)
    attachment = models.FileField(upload_to="instruction/")

    class Meta:
        ordering = ['title']

    def __str__(self) -> str:
        return f"{self.title}"

class TypeControlTool(str, Enum):
    BOUNDING_BOX = 'BOUNDING_BOX'
    POLYGON = 'POLYGON'
    POLYLINE = 'POLYLINE'
    POINT = 'POINT'
    SEGMENTATION = 'SEGMENTATION'
    RADIO = 'RADIO'
    CHECKLIST = 'CHECKLIST'
    TEXT = 'TEXT'
    DROPDOWN = 'DROPDOWN'

    @classmethod
    def choices(cls):
        return tuple((x.value, x.name) for x in cls)
    
    def __str__(self):
        return self.value

class Control(models.Model):
    name = SafeCharField(max_length=256)
    tool = models.ForeignKey(Tool, on_delete=models.CASCADE)
    type = models.CharField(max_length=32, choices=TypeControlTool.choices(),
                default=TypeControlTool.BOUNDING_BOX)
    require = models.BooleanField(default=False)
    def __str__(self):
        return self.name

    class Meta:
        unique_together = ('tool', 'name')

class Label(models.Model):
    name = SafeCharField(max_length=256)
    color = models.CharField(max_length=64, null=True, blank=True)
    tool = models.ForeignKey(Tool, on_delete=models.CASCADE)
    code = models.CharField(max_length=64, null=True, blank=True)
    def __str__(self):
        return self.name

    class Meta:
        unique_together = ('tool', 'name')