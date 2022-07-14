
from backend.apps.editor.models import Label
from django.db import models
from django.db.models import fields, query
from numpy import source
# from django.http import request
from rest_framework import serializers
from backend.apps.distributor.models import *
from backend.apps.authentication.serializers import *
from .models import *
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
class ActivityLogSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    # user_id = serializers.IntegerField(read_only=True)
    user = UserSerializer(read_only=True)
    project_id = serializers.IntegerField(required=False, allow_null=True)
    member_id = serializers.IntegerField(required=False, allow_null=True)
    workitem_id = serializers.IntegerField(required=False, allow_null=True)
    label_id = serializers.IntegerField(required=False, allow_null=True)
    labeleditem_id = serializers.IntegerField(required=False, allow_null=True)
    tool_id = serializers.IntegerField(required=False, allow_null=True)
    action_time = serializers.DateTimeField(required=False)
    object = serializers.CharField(required=False, allow_null=True)
    action = serializers.CharField(required=False, allow_null=True)
    change_message = serializers.CharField(required=False, allow_null=True)
    value = serializers.JSONField(required=False, allow_null=True)

    class Meta:
        model = ActivityLog
        fields = ('id', 'user_id', 'project_id', 'member_id', 'workitem_id',
                'action_time', 'object', 'action', 'change_message', 'value','user')
        ordering = ['-id']
    
    def create(self, validataion):
        # validataion.pop('user_id')
        request = self.context.get("request")
        user_id = request.user.id
        db_userlog = ActivityLog.objects.create(user_id=user_id, **validataion)
        return db_userlog
