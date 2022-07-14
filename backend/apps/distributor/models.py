from django.db import models
from django.conf import settings
from backend.apps.cms.models import Dataset, Member, ProjectSetting, Projects, RoleChoice, StatusChoice
from backend.apps.uploader.models import *
from enum import Enum
from django.core.validators import MinValueValidator, MaxValueValidator
class TypeItemChoice(str, Enum):
    ORIGINAL = 'ORIGINAL'
    OVERLAP = 'OVERLAP'
    SKIPPED = 'SKIPPED'
    @classmethod
    def choices(cls):
        return tuple((x.value, x.name) for x in cls)

    def __str__(self):
        return self.value

class WorkItem(models.Model):
    member = models.ManyToManyField(Member, through='MemberWorkItem')
    project = models.ForeignKey(Projects, on_delete=models.CASCADE)
    row = models.ForeignKey(Image, on_delete=models.CASCADE)
    type = models.CharField(max_length=64, choices=TypeItemChoice.choices())
    status = models.CharField(max_length=64, choices=StatusChoice.choices(), default=StatusChoice.ANNOTATION)

class QueueMember(models.Model):
    project = models.ForeignKey(Projects, null=True, blank=True ,on_delete=models.CASCADE)
    member = models.ForeignKey(Member, null=True, blank=True ,on_delete=models.CASCADE)
    accuracy = models.FloatField(default=0.0, validators=[
                MaxValueValidator(100),
                MinValueValidator(0)
    ])
    date_created = models.DateTimeField(auto_now_add=True, auto_created=True)
    date_validated = models.DateTimeField(auto_now_add=False, auto_created=False, null=True, blank=True)
    submited_item = models.IntegerField(default=0)
    skipped_item = models.IntegerField(default=0)
    completed_item = models.IntegerField(default=0)
    size_item = models.IntegerField(default=0)
    status = models.CharField(max_length=64, null=True, blank=True, choices=StatusChoice.choices())

class MemberWorkItem(models.Model):
    member = models.ForeignKey(Member, null=True, blank=True ,on_delete=models.CASCADE)
    workitem = models.ForeignKey(WorkItem, on_delete=models.CASCADE)
    queue = models.ForeignKey(QueueMember,null=True, blank=True, on_delete=models.CASCADE)
    status = models.CharField(max_length=64, choices=StatusChoice.choices(), default=StatusChoice.ANNOTATION)
    role = models.CharField(max_length=64, choices=RoleChoice.choices(), default=RoleChoice.LABELER)
    accuracy = models.FloatField(default=0.0,validators=[
                MaxValueValidator(100),
                MinValueValidator(0)
                ])