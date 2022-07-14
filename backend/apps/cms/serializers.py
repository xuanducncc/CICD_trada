from functools import partial
from re import I
from django.http import request
from django.urls.conf import path
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
from backend.apps.annotator.serializers import LabeledItemSerializer
from backend.apps.uploader.serializers import ImageWorkItemSerializer
class ProjectSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Projects
        fields = ('id', 'name', 'description', 'owner_id', 'create_date', 'update_date', 'status', 'dataset_list')
        read_only_fields = ('name',)
        ordering = ['-id']

class DatasetSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dataset
        fields = ('id', 'name', 'projects', 'creator_id', 'create_date', 'num_photos', 'in_type', 'status') 
        ordering = ['-id']

class DatasetSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(required=True)
    projects = serializers.PrimaryKeyRelatedField(queryset=Projects.objects.all(), many=True, required=False)
    creator_id = serializers.IntegerField(required=False)
    in_type = serializers.ChoiceField(choices=TypeChoice.choices(),default=TypeChoice.SEGMENT)
    status = serializers.ChoiceField(choices=StatusChoice.choices(),default=StatusChoice.ACTIVE)
    num_photos = serializers.IntegerField(required=False)
    create_date = serializers.DateTimeField(read_only=True)
    class Meta:
        models = Dataset
        fields = ('id', 'name', 'projects_id', 'creator_id', 'create_date',
                    'num_photos', 'in_type', 'status', 'create_date') 
        read_only_fields = ('creator_id', 'in_type')
        ordering = ['-id']
    
    def create(self, validated_data):
        if validated_data.get('projects') == None or validated_data.get('projects') == []:
            validated_data.pop('projects')
            db_dataset = Dataset.objects.create(**validated_data)
        else:
            projects = validated_data.pop('projects')
            db_dataset = Dataset.objects.create(**validated_data)
            db_dataset.projects.add(*projects)
            db_dataset.save()
        return db_dataset

class ProjectSettingSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    project_id = serializers.IntegerField(required=True)
    overlap_enable = serializers.BooleanField(default=False)
    overlap_percent = serializers.IntegerField(default=0)
    overlap_time = serializers.IntegerField(default=5)
    review_enable = serializers.BooleanField(default=False)
    review_percent = serializers.IntegerField(default=0)
    queue_size = serializers.IntegerField(default=5)
    review_vote = serializers.IntegerField(default=3)
    class Meta:
        models = ProjectSetting
        fields = ('id', 'project_id', 'overlap_enable', 'overlap_percent',
                    'overlap_time', 'review_enable', 'review_percent', 'queue_size')
        ordering = ['-id']
    
    def create(self, validate_data):
        ProjectSetting.objects.filter(project_id=validate_data.get('project_id')).delete()
        db_projectset = ProjectSetting.objects.create(**validate_data)
        db_projectset.save()
        return db_projectset

class ProjectSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(required=True)
    description = serializers.CharField(allow_null=True, required=False, allow_blank=True)
    dataset_list = DatasetSerializer(many=True, read_only = True)
    owner_id = serializers.IntegerField(read_only=True)
    create_date = serializers.DateTimeField(read_only=True)
    update_date = serializers.DateTimeField(read_only=True)
    status = serializers.CharField(read_only=True)
    # projectsetting = ProjectSettingSerializer(read_only=True, many=True)
    class Meta:
        model = Projects
        fields = ('id', 'name', 'description', 'owner_id', 'created_date', 'updated_date', 'status', 'dataset_list')
        read_only_fields = ('created_date', 'updated_date', 'owner_id')
        ordering = ['-id']

    def create(self, validated_data):
        request = self.context.get("request")
        user_id = request.user.id
        db_project = Projects.objects.create(owner_id=user_id,**validated_data)
        db_project.save()
        member = Member.objects.create(project=db_project, status='JOINED', user_id=user_id)
        member.role.add(
            ProjectRole.objects.get(name="ADMIN")
        )
        return db_project
        
class ProjectRoleSerializer(serializers.Serializer):
    name = serializers.ChoiceField(choices=RoleChoice.choices(), default=RoleChoice.LABELER)

class MemberSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    user_id = serializers.IntegerField()
    role = ProjectRoleSerializer(many=True, partial=True)
    # status = serializers.ChoiceField(choices=StatusChoice.choices(), allow_null=True, required=False)
    status = serializers.CharField(read_only=True)
    project_id = serializers.IntegerField(required=True)
    accuracy = serializers.FloatField(read_only=True)
    completed_rate = serializers.FloatField(read_only=True)
    join_date = serializers.DateTimeField(read_only=True, allow_null=True)
    benchmark_date = serializers.DateTimeField(read_only=True, allow_null=True)
    is_active = serializers.BooleanField(read_only=True)
    user = UserSerializer(partial=True)
    class Meta:
        model = Member
        fields = ('id', 'user_id', 'status', 'project_id', 'user_name', 'role','is_active')
        ordering = ['-id']

class WorkItemMemberSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    status = serializers.CharField(read_only=True)
    role = serializers.CharField(read_only=True)
    queue_id = serializers.IntegerField(read_only=True)
    member = MemberSerializer(partial=True)
    accuracy = serializers.FloatField(read_only=True)
    # workitem = WorkItemLabeledSerializer(many=True, partial=True)
    class Meta:
        model = MemberWorkItem
        fields = ('id', 'status', 'role', 'workitem', 'queue_id', 'member', 'accuracy',)
        ordering = ['-id']
class WorkItemSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    row = ImageWorkItemSerializer()
    project_id = serializers.IntegerField(required=True)
    status = serializers.ChoiceField(choices=StatusChoice.choices(), default=StatusChoice.ANNOTATION)
    type = serializers.ChoiceField(choices=TypeItemChoice.choices(), default=TypeItemChoice.ORIGINAL)
    memberworkitem = WorkItemMemberSerializer(many=True, source="memberworkitem_set", partial=True)
    labeleditem = LabeledItemSerializer(many=True, source="labeleditem_set", partial=True)
    
    class Meta:
        model = WorkItem
        fields = ('id', 'member_id', 'row_image', 'status', 'project_id','memberworkitem', 'labeleditem')
        ordering = ['-id']
 
class QueueMemberSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    project_id = serializers.IntegerField(required=True)
    member = MemberSerializer(partial=True)
    accuracy = serializers.FloatField(read_only=True)
    date_created = serializers.DateTimeField(read_only=True)
    date_validated = serializers.DateTimeField(read_only=True)
    submited_item = serializers.IntegerField(read_only=True)
    skipped_item = serializers.IntegerField(read_only=True)
    completed_item = serializers.IntegerField(read_only=True)
    size_item = serializers.IntegerField(read_only=True)
    status = serializers.CharField(read_only=True)
    # mb_workitem = WorkItemMemberSerializer(many=True, source="memberworkitem_set", partial=True)

    class Meta:
        models = QueueMember
        fields = ('id', 'member_id', 'accuracy', 'date_created', 'date_validated',
                'submited_item', 'skipped_item', 'completed_item', 'size_item', 'status')
        ordering = ['-id']

class MemberDetailSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    role = ProjectRoleSerializer(many=True, partial=True)
    status = serializers.CharField(read_only=True)
    project_id = serializers.IntegerField(read_only=True)
    accuracy = serializers.FloatField(read_only=True)
    completed_rate = serializers.FloatField(read_only=True)
    join_date = serializers.DateTimeField(read_only=True, allow_null=True)
    benchmark_date = serializers.DateTimeField(read_only=True, allow_null=True)
    label_count = serializers.IntegerField(read_only=True)
    submit_count = serializers.IntegerField(read_only=True)
    skip_count = serializers.IntegerField(read_only=True)
    total_time = serializers.IntegerField(read_only=True)
    is_active = serializers.BooleanField(read_only=True)
    user = UserSerializer(partial=True)
    queuemember = QueueMemberSerializer(many=True, source='queuemember_set',partial=True )
    class Meta:
        model = Member
        fields = ('id', 'role', 'user', 'project_id', 'status', 'role', 'queuemember','is_active')
        ordering = ['-id']

class ChangeRoleSerializer(serializers.Serializer):
    member_id = serializers.IntegerField(required=True)
    role = serializers.CharField(required=True)
    action = serializers.CharField(required=True)

