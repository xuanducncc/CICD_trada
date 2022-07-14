from backend.apps.cms.models import *
from backend.apps.distributor.models import *
from django.contrib.auth.models import AbstractUser
from django.db import models
from enum import Enum
from django.core.validators import MinValueValidator, MaxValueValidator
class User(AbstractUser):
    credit_score = models.FloatField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return f'<{self.id}> {self.username}'
