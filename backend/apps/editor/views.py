import django
import django_filters
from numpy.core.arrayprint import set_string_function
from backend.apps.cms.serializers import ImageWorkItemSerializer, WorkItemSerializer
from numpy import datetime64
from django_filters import filterset, rest_framework as filters
from backend.apps.uploader.models import Image
from backend.apps.distributor.models import *
from backend.apps.annotator.models import *
from backend.apps.annotator.serializers import *
import re
from typing import Generator, overload
from django.db import models
from django.db.models import fields, query, Q
from django.http.response import JsonResponse
from rest_framework.fields import ListField
from rest_framework.mixins import UpdateModelMixin
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import permissions, serializers, views
from rest_framework.generics import CreateAPIView, DestroyAPIView, UpdateAPIView, GenericAPIView, ListAPIView
from rest_framework.generics import mixins
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from .models import *
import ast
import coreapi
from drf_yasg.utils import swagger_auto_schema
from django.http import HttpResponse
from django.core.paginator import Paginator
class EditorCreate(CreateAPIView):
    """Create a new Editor"""
    serializer_class = EditorSerializer

class ProjectEditorList(views.APIView):
    def get(self, request, pk):
        db_editor = Editor.objects.get(project_id = pk)
        serializer = EditorSerializer(db_editor)

        return Response(serializer.data, status=status.HTTP_200_OK)
class EditorUpdateSerializer(serializers.Serializer):
    project_id = serializers.IntegerField(required=True)
    type = serializers.ChoiceField(choices=TypeEditorChoice.choices())
    tool = ToolSerializer(many=True, source='tool_set', partial=True)
class EditorUpdate(GenericAPIView):
    """Update a Editor"""
    serializer_class = EditorUpdateSerializer
    queryset = Editor.objects.all()
    def post(self, request, pk):
        db_editor = Editor.objects.get(id = pk) 
        data = ast.literal_eval(request.body.decode("UTF-8"))
        db_editor.project_id = data.get('project_id')
        db_editor.type = data.get('type')
        db_tools = Tool.objects.filter(editor = db_editor)
        db_tools.delete()
        tools = data['tool']
        for tool in tools:
            db_tool = Tool.objects.create(
                    editor = db_editor,
                    type = tool.get('type'))
            db_tool.save()
            labels = tool.get('label')
            controls = tool.get('control')
            for label in labels:
                Label.objects.create(tool=db_tool, **label)
            for control in controls:
                Control.objects.create(tool=db_tool, **control)
        
        return Response(data, status=status.HTTP_200_OK)
create_editor = EditorCreate.as_view()
update_editor = EditorUpdate.as_view()

class ToolCreate(CreateAPIView):
    """Create a new Tool"""
    serializer_class = ToolSerializer

class ToolUpdate(GenericAPIView):
    """Update Tool"""
    serializer_class = ToolSerializer
    queryset = Tool.objects.all()
    def put(self, request, pk):
        db_tool = Tool.objects.get(id = pk)
        data = ast.literal_eval(request.body.decode("UTF-8"))
        db_tool.editor_id = data['editor_id']
        db_tool.type = data['type']
        db_tool.save()
        labels = data['label']
        db_labels = Label.objects.filter(tool=db_tool)
        db_labels.delete()
        for lab in labels:
            db_label = Label.objects.create(tool=db_tool,**lab)
        return Response(data, status=status.HTTP_200_OK)


create_tool = ToolCreate.as_view()
update_tool = ToolUpdate.as_view()

class QueueFilter(django_filters.FilterSet):
    member = filters.NumberFilter(field_name='member')
    project_id = filters.NumberFilter(field_name='project_id', required=True)
    queue_id = filters.NumberFilter(field_name='queue_id')
    status = filters.CharFilter(field_name='status')
    role = filters.CharFilter(field_name='role')
    page = filters.NumberFilter(field_name='page')
    page_size = filters.NumberFilter(field_name='page_size')
    labelcode = filters.CharFilter(field_name='label')
    id = filters.CharFilter(field_name='id')
    class Meta:
        models = WorkItem
        fields = ["id", "member", "project_id", "queue_id", "role"]
class QueueList(GenericAPIView):
    # queryset = WorkItem.objects.all()
    serializer_class = WorkItemSerializer
    search_fields = ("member", "project_id","queue_id", "status", "role")
    filterset_class = QueueFilter
    ordering_fields = ("member", "project_id","queue_id")
    def get(self,request):
        user_id = request.user.id
        data = self.request.query_params
        _filters = {}
        page, page_size, label = None, 10, None
        for param in data:
            if param == "queue_id":
                _data = data.get(param)
                param = "memberworkitem__queue_id"
                _filters.update({param: _data})
            elif param == "status":
                _data = data.get(param)
                param = "memberworkitem__status"
                _filters.update({param: _data})
            elif param == "role":
                _data = data.get(param)
                param = "memberworkitem__role"
                _filters.update({param: _data})
            elif param == "labelcode":
                _data = data.get(param)
                param = "labeleditem__labelCode"
                _filters.update({param: _data})
            elif param == "page":
                page = data.get(param)
            elif param == "page_size":
                page_size = data.get(param)
            else:
                _filters.update({param: data.get(param)})
        workitem_list = WorkItem.objects.prefetch_related('memberworkitem_set').filter(**_filters)
        headers = {
                "Pagination-Count": len(workitem_list),
                "Pagination-Page": 0,
                "Pagination-Limit": 0
                }
        if page != None:
            print("page_size",int(page_size))
            seri_pagi = Paginator(workitem_list, int(page_size))
            page_obj = seri_pagi.get_page(int(page))
            serializers = WorkItemSerializer(page_obj.object_list, many=True).data
            headers = {
                "Pagination-Count": seri_pagi.count,
                "Pagination-Page": int(page),
                "Pagination-Limit": seri_pagi.num_pages
                }
        else:
            serializers = WorkItemSerializer(workitem_list, many=True).data
        return Response(serializers, headers=headers)
        
class CreateInstructions(CreateAPIView):
    serializer_class = IntructionSerializer

class ListInstructions(ListAPIView):
    def get(self, request, pk):
        db_instruction = Instruction.objects.filter(project_id=pk)
        serializers = IntructionSerializer(db_instruction, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)

class AttachmentInstructions(ListAPIView):
    def get(self, request, pk):
        ins = Instruction.objects.get(id = pk)
        ins_name = str(ins.attachment)
        attachment_path = os.path.join(settings.MEDIA_ROOT,ins_name)
        try:
            with open(attachment_path,'rb') as f:
                img = f.read()
            response = HttpResponse(img, content_type='image')
            response['Content-Disposition'] = 'attachment; filename="{}"'.format(ins_name)
        except Exception as E:
            return Response({"error":{"message": "Instruction not found"}}, status=status.HTTP_409_CONFLICT)
        return response

list_queue = QueueList.as_view()
project_editor_list = ProjectEditorList.as_view()
create_instructions = CreateInstructions.as_view()
list_instructions = ListInstructions.as_view()
attachment_instructions = AttachmentInstructions.as_view()