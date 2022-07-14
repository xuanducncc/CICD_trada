from enum import Enum
import re
import os
from django.db import models
from django.conf import settings
from backend.apps.authentication.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
class SafeCharField(models.CharField):
    def get_prep_value(self, value):
        value = super().get_prep_value(value)
        if value:
            return value[:self.max_length]
        return value

class StatusChoice(str, Enum):
    REVIEWING = 'REVIEWING'
    REVIEWED = 'REVIEWED'
    PENDING = 'PENDING'
    ANNOTATION = 'ANNOTATION'
    VALIDATION = 'VALIDATION'
    COMPLETED = 'COMPLETED'
    SKIPPED = 'SKIPPED'
    SUBMITED = 'SUBMITED'
    REJECTED = 'REJECTED'
    ACTIVE = 'ACTIVE'
    INACTIVE = 'INACTIVE'
    INVITED = 'INVITED'
    REQUESTED = 'REQUESTED'
    JOINED = 'JOINED'
    WAITING = 'WAITING'
    @classmethod
    def choices(cls):
        return tuple((x.value, x.name) for x in cls)

    def __str__(self):
        return self.value

class TypeChoice(str, Enum):
    SEGMENT = 'SEGMENT'
    CLASSIFICATION = 'CLASSIFICATION'
    AUDIO = 'AUDIO'

    @classmethod
    def choices(cls):
        return tuple((x.value,x.name) for x in cls)
    
    def __str__(self):
        return self.value

class RoleChoice(str, Enum):
    REVIEWER = 'REVIEWER'
    LABELER = 'LABELER'
    ADMIN = 'ADMIN'

    @classmethod
    def choices(cls):
        return tuple((x.value,x.name) for x in cls)
    
    def __str__(self):
        return self.value
class Projects(models.Model):
    name = SafeCharField(max_length=256)
    owner = models.ForeignKey(User, null=True, blank=True,
            on_delete=models.SET_NULL, related_name='+')
    description = models.CharField(max_length=1024, null=True,blank=True)
    create_date = models.DateTimeField(auto_now_add=True)
    update_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=64, choices=StatusChoice.choices(),
            default=StatusChoice.PENDING)
    
    def __str__(self):
        return self.name

class Dataset(models.Model):
    name = SafeCharField(max_length=256)
    creator = models.ForeignKey(User, null=True, blank=True,
                on_delete=models.SET_NULL, related_name='+')
    projects = models.ManyToManyField(Projects, related_name='dataset_list')
    create_date = models.DateTimeField(auto_now_add=True)
    num_photos = models.IntegerField(null=True,blank=True)
    in_type = models.CharField(max_length=64, choices=TypeChoice.choices())
    status = models.CharField(max_length=64, choices=StatusChoice.choices(),
            default=StatusChoice.ACTIVE)
    
    def __str__(self):
        return self.name

class ProjectRole(models.Model):
    name = models.CharField(max_length=64, choices=RoleChoice.choices(), default=RoleChoice.LABELER)

class Member(models.Model):
    user = models.ForeignKey(User, null=True, blank=True,
                on_delete=models.SET_NULL, related_name='+')
    role = models.ManyToManyField(ProjectRole, related_name='members')
    status = models.CharField(max_length=64, choices=StatusChoice.choices())
    project = models.ForeignKey(Projects, on_delete=models.CASCADE)
    accuracy = models.FloatField(default=0.0,validators=[
                MaxValueValidator(100),
                MinValueValidator(0)
                ])
    completed_rate = models.FloatField(default=0.0,validators=[
            MaxValueValidator(100),
                MinValueValidator(0)
            ])
    join_date = models.DateTimeField(auto_now_add=True)
    benchmark_date = models.DateTimeField(auto_now_add=True)
    time_per = models.IntegerField(default=0)
    total_rejected = models.IntegerField(default=0)
    label_count = models.IntegerField(default=0)
    submit_count = models.IntegerField(default=0)
    skip_count = models.IntegerField(default=0)
    total_time = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
class ProjectSetting(models.Model):
    project = models.ForeignKey(Projects, null=True, blank=True, 
                    on_delete=models.SET_NULL, related_name='+')
    overlap_enable = models.BooleanField(default=False)
    overlap_percent = models.IntegerField(default=0, validators=[
                MaxValueValidator(100),
                MinValueValidator(0)
                ])
    overlap_time = models.IntegerField()
    review_enable = models.BooleanField(default=False)
    review_percent = models.IntegerField(default=0, validators=[
                MaxValueValidator(100),
                MinValueValidator(0)
                ])
    queue_size = models.IntegerField(default=5, validators=[
                MinValueValidator(5)
                ])
    review_vote = models.IntegerField(default=3, validators=[MinValueValidator(2)])

