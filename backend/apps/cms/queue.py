import django_filters
from rest_framework.views import APIView
from backend.apps.cms.models import *
from backend.apps.annotator.models import *
from backend.apps.distributor.models import *
from backend.apps.editor.models import *
from backend.apps.cms.serializers import *
from django.db.models import fields, query, Q
from django_filters import rest_framework as filters
from rest_framework.generics import *
from rest_framework.response import Response
from rest_framework import status
import ast
from datetime import datetime
from rest_framework.pagination import PageNumberPagination
class ProjectQueueListFilter(django_filters.FilterSet):
    project_id = filters.NumberFilter(field_name='project_id', required=True)
    status = filters.CharFilter(field_name='status')
    member_id = filters.NumberFilter(field_name='member_id')
    class Meta:
        model = QueueMember
        fields = ('project_id', 'status', 'member_id')

class ProjectQueuePaginator(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100
    def get_paginated_response(self, data):
        return Response(data
        , headers={
            "Pagination-Count": self.page.paginator.count,
            "Pagination-Page": self.page.number,
            "Pagination-Limit": self.page.paginator.num_pages
        })

class ProjectQueueList(ListAPIView):
    queryset = QueueMember.objects.all().order_by("-id")
    serializer_class = QueueMemberSerializer
    search_fields = ("member_id", "project_id", "status")
    filterset_class = ProjectQueueListFilter
    ordering_fields = ('member_id', 'project_id', 'status', 'id')
    pagination_class = ProjectQueuePaginator
    
    # def get(self, request, pk):
    #     user_id = request.user.id
    #     data = self.request.query_params
    #     fill = {}
    #     for _data in data:
    #         fill.update({_data:int(data[_data][0])})
    #     queryset = QueueMember.objects.filter(project_id=pk,**fill)
    #     serializers = QueueMemberSerializer(queryset, many=True)
    #     # for result in serializers.data:
    #     #     mb_workitems = result.get("mb_workitem")
    #     #     result.update({"workitem": []})
    #     #     for mb_workitem in mb_workitems:
    #     #         workitem = WorkItem.objects.get(memberworkitem=mb_workitem["id"])
    #     #         result["workitem"].append(WorkItemSerializer(workitem).data)
    #     return Response(serializers.data, status=status.HTTP_200_OK)

class QueueDetail(APIView):
    def get(self, request, pk):
        db_queuemember = QueueMember.objects.get(id=pk)
        db_mbworkitem = MemberWorkItem.objects.filter(queue=db_queuemember)
        serializer = []
        for mbworkitem in db_mbworkitem:
            workitem = mbworkitem.workitem
            serializer.append(WorkItemSerializer(workitem).data)
        return Response(serializer, status=status.HTTP_200_OK)

queue_list = ProjectQueueList.as_view()
queue_detail = QueueDetail.as_view()
