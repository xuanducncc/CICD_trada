from re import L
from django import db
from django.db import models
from django.db.models import fields, query
from django.http import request
from backend.apps.cms.models import *
from backend.apps.editor.models import *
from backend.apps.distributor.models import *
from rest_framework import serializers
from .models import *
from backend.apps.uploader.models import *
from backend.apps.cms.serializers import *

class WorkItemVoteSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    labeleditem_id = serializers.IntegerField(read_only=True)
    member_id = serializers.IntegerField(read_only=True)
    score = serializers.IntegerField(read_only=True)

class LabeledItemSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    workitem_id = serializers.IntegerField(read_only=True)
    label_id = serializers.IntegerField(required=True)
    index = serializers.IntegerField(default=None)
    tool_id = serializers.IntegerField(required=True)
    toolType = serializers.ChoiceField(choices=TypeToolChoice.choices())
    controlType = serializers.ChoiceField(choices=TypeControlTool.choices())
    labelCode = serializers.CharField(default=None)
    labelName = serializers.CharField()
    labelValue = serializers.JSONField()
    color = serializers.CharField(default='red')
    vote = WorkItemVoteSerializer(many=True, source="workitemvote_set", partial=True)
    class Meta:
        models = LabeledItem
        fields = ('id', 'workitem_id', 'toolType', 'controlType', 'index','label_id',
                'tool_id','labelCode', 'labelName','labelValue')
        ordering = ['-id']

        def create(self, validate_data):
            db_labeleditem = LabeledItem.objects.create(**validate_data)
            db_labeleditem.save()
            return db_labeleditem
class ImageWSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    image = serializers.ImageField()
    dataset_id = serializers.IntegerField()
    class Meta:
        models = Image
        fields = ('id', 'image', 'dataset_id')
        ordering = ['-id']
class WorkItemLabeledSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    row = ImageWSerializer(partial=True)
    project_id = serializers.IntegerField(required=True)
    status = serializers.ChoiceField(choices=StatusChoice.choices(), default=StatusChoice.ANNOTATION)
    type = serializers.ChoiceField(choices=TypeItemChoice.choices(), default=TypeItemChoice.ORIGINAL)
    labeledItems = LabeledItemSerializer(many=True, source = "labeleditem_set", partial=True)
    class Meta:
        model = WorkItem
        fields = ('id', 'member_id', 'row_image', 'status', 'project_id','type','labeledItems','vote')
        ordering = ['-id']
 
