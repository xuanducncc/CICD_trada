from datetime import date
from backend.apps.validator.models import WorkItemVote
from rest_framework.schemas.coreapi import field_to_schema
from backend.apps.editor.models import Editor
from typing import Generator, List
from django.db.models.fields import json
from numpy import datetime64, trunc
from django.views import generic
from django.db.models import Min
from backend.apps.uploader.models import Image
from backend.apps.distributor.models import *
from backend.apps.cms.models import *
from django.db import models
from django.db.models import  *
from django.db.models.functions import *
from django.http.response import JsonResponse
from django_filters import filterset, rest_framework as filters
from rest_framework.fields import ListField
from rest_framework.mixins import UpdateModelMixin
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import permissions, serializers, views
from rest_framework.generics import *
from rest_framework.generics import mixins
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.filters import BaseFilterBackend    
from .serializers import *
from .models import *
import ast
import coreapi
import django_filters
from drf_yasg.utils import get_serializer_class, swagger_auto_schema
from django.utils.decorators import method_decorator
from distributor.distributor import Distribute, Generate
from drf_yasg import openapi
from rest_framework.schemas import AutoSchema, ManualSchema
import numpy as np
from dateutil import rrule, parser
from rest_framework.pagination import PageNumberPagination
class ActivityLogCreate(CreateAPIView):
    serializer_class = ActivityLogSerializer

class UserLogWorkItem(GenericAPIView):
    serializer_class = ActivityLogSerializer
    def post(self, request):
        user_id = request.user.id
        data = ast.literal_eval(request.body.decode("UTF-8"))
        project_id = data.get('project_id')
        member_id = data.get('member_id')
        workitem_id = data.get('workitem_id')
        db_userlog = ActivityLog.objects.filter(workitem_id=workitem_id, object='LABELED', action='LOGIN',
                    member_id=member_id, project_id=project_id)
        if db_userlog.count() > 0:
            db_userlog.delete()
        ActivityLog.objects.create(user_id=user_id, member_id=member_id, project_id=project_id,
                            workitem_id=workitem_id, object='LABELED', action = 'LOGIN')
        return Response(status=status.HTTP_200_OK)


class LabeledItemCountFilter(django_filters.FilterSet):
    member_id = filters.NumberFilter(field_name='member_id')
    project_id = filters.NumberFilter(field_name='project_id', required=True)
    label_id = filters.NumberFilter(field_name='label_id')
    tool__type = filters.CharFilter(field_name='tool__type', lookup_expr="icontains")
    class Meta:
        models = ActivityLog
        fields = ["id", "member_id", "project_id","label_id","tool__type"]
class LabeledItemCount(GenericAPIView):
    queryset = ActivityLog.objects.filter(object="LABELED_ITEM")
    serializer_class = ActivityLogSerializer
    search_fields = ("member_id", "project_id","label_id","tool__type")
    filterset_class = LabeledItemCountFilter
    ordering_fields = ('member_id', 'project_id', 'label_id','tool__type')
 
    def get(self, request):
        user_id = request.user.id
        data = self.request.query_params
        results = {}
        for param in data:
            results.update({param: data.get(param)})
        query_filter = self.queryset.filter(**results,object="LABELED_ITEM", action="CREATED")
        result = query_filter\
            .annotate(date=Trunc('action_time','date',DateField())).values('date').\
                annotate(count=Count('date')).values('date','count')
        total_labeleditem = query_filter.count() if query_filter.count() != 0 else 1
        results.update({'LabeledItem_Count': result})
        member_id = results.get('member_id')
        project_id = results.get('project_id')
        if member_id == None:
            members = Member.objects.filter(project_id=project_id, role__name__in=["LABELER"])
            num_members = members.count()
            if num_members != 0:
                results['Avg_Count'] = round(query_filter.count()/num_members,2)
                total_time = 0
                for actilog in query_filter:
                    total_time += actilog.value['working_time']
                results['Avg_Total_Time'] = round(total_time/num_members,2)
                results['Avg_Time_Per'] = round(total_time/total_labeleditem,2)
                for day in results['LabeledItem_Count']:
                    date = day['date']
                    db_acti = query_filter.filter(action_time__date = date)
                    times = 0
                    for log in db_acti:
                        times += log.value['working_time']
                    day['Total_Time'] = times
                    day['Time_Per_Label'] = round(times/day['count'],2)
        else:
            results['Avg_Count'] = query_filter.count()
            total_time = 0
            for actilog in query_filter:
                total_time += actilog.value['working_time']
            results['Avg_Total_Time'] = total_time
            results['Avg_Time_Per'] = round(total_time/total_labeleditem,2)
            for day in results['LabeledItem_Count']:
                    date = day['date']
                    db_acti = query_filter.filter(action_time__date = date)
                    times = 0
                    for log in db_acti:
                        times += log.value['working_time']
                    day['Total_Time'] = times
                    day['Time_Per_Label'] = round(times/day['count'],2)
        return Response(results)

class LabeledItemHistory(views.APIView):
    def post(self, request, pk):
        project_id = pk
        db_logger = ActivityLog.objects.filter(object="LABELED_ITEM", project_id=project_id, action="CREATED")
        db_member = Member.objects.filter(project_id=project_id, role=ProjectRole.objects.get(name="LABELER"), status="JOINED")
        count_labeled = db_logger.annotate(date=Trunc('action_time','date',DateField())).values('member','date').\
            annotate(count=Count('date')).values('member','date','count')
        datetime_max = count_labeled.aggregate(Max('date'))['date__max']
        datetime_min = count_labeled.aggregate(Min('date'))['date__min']
        if datetime_min == None or datetime_max == None:
            return Response([], status=status.HTTP_200_OK)
        range_date = list(rrule.rrule(rrule.DAILY, dtstart=parser.parse(str(datetime_min)), until=parser.parse(str(datetime_max))))
        history = []
        for _date in range_date:
            labeled_date = _date.date()
            history.append({
                "members":[],
                "date": labeled_date
            })
            for member in db_member:
                member_id = member.id
                history[-1]["members"].append({
                    "member":{
                        "id": member_id,
                        "username": member.user.username
                    },
                    "count": 0
                })
                for labeled in count_labeled:
                    if member_id == labeled['member'] and labeled_date == labeled['date']:
                        history[-1]["members"][-1]["count"] = labeled['count']
        return Response(history, status=status.HTTP_200_OK)

class LogWorkItemFilter(django_filters.FilterSet):
    member_id = filters.NumberFilter(field_name='member_id')
    project_id = filters.NumberFilter(field_name='project_id', required=True)
    action = filters.CharFilter(field_name='action', lookup_expr="icontains")
    class Meta:
        models = ActivityLog
        fields = ["id", "member_id", "project_id"]

class LogWorkItemPaginator(PageNumberPagination):
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
class ActivityLogWorkItem(ListAPIView):
    
    queryset = ActivityLog.objects.filter(~Q(action="START"),object="WORK_ITEM").order_by("-id")
    serializer_class = ActivityLogSerializer
    search_fields = ("member_id", "project_id","label_id","tool__type")
    filterset_class = LogWorkItemFilter
    ordering_fields = ('member_id', 'project_id', 'label_id','tool__type')
    pagination_class = LogWorkItemPaginator

create_activitylog = ActivityLogCreate.as_view()
count_labeleditem = LabeledItemCount.as_view()
log_workitem = ActivityLogWorkItem.as_view()
history_labeled = LabeledItemHistory.as_view()

class MemberPerformance(views.APIView):
    def get(self, request, pk):
        member_id = pk
        db_member = Member.objects.get(id=member_id)
        project_id = db_member.project_id
        mbwi = MemberWorkItem.objects.filter(member_id=member_id, role="LABELER", status__in=["SUBMITED", "SKIPPED"])
        mbwi_submit = mbwi.filter(status="SUBMITED").count()
        mbwi_skip = mbwi.filter(status="SKIPPED").count()
        dbworkitem = WorkItem.objects.prefetch_related("memberworkitem_set").\
            filter(
                project_id = project_id,
                memberworkitem__member_id = member_id,
                memberworkitem__role = "LABELER",
                memberworkitem__status__in = ["SUBMITED"]
            )
        dblabeleditem = LabeledItem.objects.filter(workitem__in=dbworkitem)
        dbvote = WorkItemVote.objects.filter(labeleditem__in=dblabeleditem)

        votelike = dbvote.filter(score = 1).count()
        votedislike = dbvote.filter(score = -1).count()
        accuracy = db_member.accuracy
        workitem_accepted = dbworkitem.filter(status="COMPLETED").count()
        workitem_rejected = dbworkitem.filter(status="REJECTED").count()
        time_per = db_member.time_per
        time_per_min = Member.objects.filter(~Q(time_per=0), project_id=project_id).aggregate(Min('time_per'))['time_per__min']
        results = {
            "workitem_submit": mbwi_submit,
            "workitem_skip": mbwi_skip,
            "vote_like": votelike,
            "vote_dislike": votedislike,
            "accuracy": round(accuracy,2),
            "workitem_accepted": workitem_accepted,
            "workitem_rejected": workitem_rejected,
            "time_per": time_per,
            "time_per_min": time_per_min
        }
        return Response(results, status=status.HTTP_200_OK)

class ProjectPerformance(views.APIView):
    def get(self, request, pk):
        project_id = pk
        db_members = Member.objects.filter(project_id=project_id)
        mbwi = MemberWorkItem.objects.filter(member__in=db_members, role="LABELER", status__in=["SUBMITED", "SKIPPED"])
        mbwi_submit = mbwi.filter(status="SUBMITED").count()
        mbwi_skip = mbwi.filter(status="SKIPPED").count()
        dbworkitem = WorkItem.objects.prefetch_related("memberworkitem_set").\
            filter(
                project_id = project_id,
                memberworkitem__member__in = db_members,
                memberworkitem__role = "LABELER",
                memberworkitem__status__in = ["SUBMITED"]
            )
        dblabeleditem = LabeledItem.objects.filter(workitem__in=dbworkitem)
        dbvote = WorkItemVote.objects.filter(labeleditem__in=dblabeleditem)
        votelike = dbvote.filter(score = 1).count()
        votedislike = dbvote.filter(score = -1).count()
        workitem_accepted = dbworkitem.filter(status="COMPLETED").count()
        workitem_rejected = dbworkitem.filter(status="REJECTED").count()
        accuracy = db_members.aggregate(Avg('accuracy'))["accuracy__avg"]
        time_per_avg = db_members.filter(~Q(time_per=0)).aggregate(Avg('time_per'))["time_per__avg"]
        results = {
            "workitem_submit": mbwi_submit,
            "workitem_skip": mbwi_skip,
            "vote_like": votelike,
            "vote_dislike": votedislike,
            "accuracy": round(accuracy,2),
            "workitem_accepted": workitem_accepted,
            "workitem_rejected": workitem_rejected,
            "time_per_avg": time_per_avg
        }
        return Response(results, status=status.HTTP_200_OK)

class UserPerformance(views.APIView):
    def get(self, request, pk):
        user_id = pk
        db_members = Member.objects.filter(user_id=user_id)
        mbwi = MemberWorkItem.objects.filter(member__in=db_members, role="LABELER", status__in=["SUBMITED", "SKIPPED"])
        mbwi_submit = mbwi.filter(status="SUBMITED").count()
        mbwi_skip = mbwi.filter(status="SKIPPED").count()
        dbworkitem = WorkItem.objects.prefetch_related("memberworkitem_set").\
            filter(
                memberworkitem__member__in = db_members,
                memberworkitem__role = "LABELER",
                memberworkitem__status__in = ["SUBMITED"],
                status="COMPLETED",
            )
        dblabeleditem = LabeledItem.objects.filter(workitem__in=dbworkitem)
        dbvote = WorkItemVote.objects.filter(labeleditem__in=dblabeleditem)
        votelike = dbvote.filter(score = 1).count()
        votedislike = dbvote.filter(score = -1).count()
        workitem_accepted = dbworkitem.filter(status="COMPLETED").count()
        workitem_rejected = db_members.aggregate(Sum('total_rejected'))['total_rejected__sum']
        accuracy = db_members.aggregate(Avg('accuracy'))["accuracy__avg"]
        workitem_rejected = workitem_rejected if workitem_rejected != None else 0
        accuracy = accuracy if accuracy != None else 0
        time_per_avg = db_members.filter(~Q(time_per=0)).aggregate(Avg('time_per'))["time_per__avg"]

        complete_score = mbwi_submit*100 / (mbwi_submit + mbwi_skip) if (mbwi_submit + mbwi_skip) != 0 else 0
        review_score = votelike*100 / (votelike + votedislike) if (votelike + votedislike) !=0 else 0
        cross_check = accuracy
        accept_score = workitem_accepted*100/(workitem_rejected + workitem_accepted) if (workitem_rejected + workitem_accepted) != 0 else 0
        credit_score = round((complete_score+review_score+cross_check+accept_score)/4,2)
        db_user = User.objects.get(id=pk)
        db_user.credit_score = credit_score
        db_user.save()
        results = {
            "workitem_submit": mbwi_submit,
            "workitem_skip": mbwi_skip,
            "vote_like": votelike,
            "vote_dislike": votedislike,
            "accuracy": round(accuracy,2),
            "workitem_accepted": workitem_accepted,
            "workitem_rejected": workitem_rejected,
            "time_per_avg": time_per_avg,
            "complete_score": complete_score,
            "review_score": review_score,
            "cross_check": cross_check,
            "credit_score": credit_score,
        }
        

        return Response(results, status=status.HTTP_200_OK)


member_performance = MemberPerformance.as_view()
project_performance = ProjectPerformance.as_view()
user_performance = UserPerformance.as_view()