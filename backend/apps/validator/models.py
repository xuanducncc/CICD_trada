from enum import Enum
from django.db import models
from backend.apps.cms.models import *
from backend.apps.annotator.models import *
from backend.apps.distributor.models import *
from backend.apps.editor.models import *
from django.core.validators import MinValueValidator, MaxValueValidator

class  WorkItemVote(models.Model):
    member = models.ForeignKey(Member, null=True, blank=True ,on_delete=models.CASCADE)
    labeleditem = models.ForeignKey(LabeledItem, null=True, blank=True, on_delete=models.CASCADE)
    score = models.IntegerField(default=0, validators=[MinValueValidator(-1), MaxValueValidator(1)])

