from backend.apps.cms.datasets import attach_dataset
from backend.apps.cms.members import accept_member, admin_invite_user, deactivate_member, member_join, member_request_project
from numpy.lib.function_base import _quantile_dispatcher
from backend.apps.validator.models import WorkItemVote
from django.db.models.aggregates import Avg, Sum
from backend.apps.logger.models import ActivityLog
from backend.apps.annotator.models import LabeledItem
from backend.apps.editor.models import Editor
from backend.apps.uploader.models import Image
from backend.apps.distributor.models import *
from django.db.models import Q
from django_filters import rest_framework as filters
from rest_framework import serializers, views
from rest_framework.generics import CreateAPIView, DestroyAPIView, UpdateAPIView, GenericAPIView, ListAPIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from .models import *
import ast, json
from datetime import datetime
from drf_yasg.utils import swagger_auto_schema
from distributor.distributor import Distribute, Generate, Distri
import numpy as np
from django.conf import settings
from django.core.mail import send_mail
import textwrap
from rest_framework.pagination import PageNumberPagination
from backend.apps.cms.projects import project_detail_admin_check, project_detail_labeler_check, project_detail_reviewer_check, project_finish, project_list, project_overview

##################################################################################################
##################################################################################################
##################  PROJECTS ##################

class ProjectCreate(CreateAPIView):
    """Create a new Project"""
    serializer_class = ProjectSerializer

class ProjectUpdate(UpdateAPIView):
    """Update a project"""
    serializer_class = ProjectSerializer
    queryset = Projects.objects.all()

    def update(self, request, pk):
        queryset = Projects.objects.get(id = pk)    
        data_update = ast.literal_eval(request.body.decode("UTF-8"))
        queryset.name = data_update.get('name')
        queryset.owner_id = data_update.get('owner_id')
        queryset.description = data_update.get('description')
        queryset.save()
        return Response(status=status.HTTP_202_ACCEPTED)

class ProjectFilter(filters.FilterSet):
    name = filters.CharFilter(field_name="name", lookup_expr="icontains")
    status = filters.CharFilter(field_name="status", lookup_expr="icontains")
    list_type = filters.CharFilter(disabled=True)
    class Meta:
        models = Projects
        fields = ("id", "name", "status")
    
class ProjectList(ListAPIView):
    serializer_class = ProjectSearchSerializer
    search_fields = ("name", "status")
    filterset_class = ProjectFilter
    ordering_fields = ("id", "name","status")
    order_by = ['-id']
    
    def get_queryset(self):
        # name = self.request.query_params.get('name')
        # stt = self.request.query_params.get('status')
        list_type = self.request.query_params.get('list_type')
        user_id = self.request.user.id
        return project_list(list_type, user_id)

class ProjectAnnotationList(ListAPIView):
    serializer_class = ProjectSearchSerializer
    queryset = Projects.objects.filter(status="ANNOTATION")

class ProjectDetail(views.APIView):
    """Detail of a project"""
    serializer_class = ProjectSerializer
    def get(self, request, pk):
        user_id = request.user.id
        _member = Member.objects.filter(project_id=pk, user_id=user_id)
        db_project = Projects.objects.get(id = pk)
        detail = ProjectSerializer(db_project).data
        db_projectstt = ProjectSetting.objects.get(project_id = pk)
        detail['setting'] = ProjectSettingSerializer(db_projectstt).data
        # db_member = Member.objects.filter(project_id = pk)
        if _member.count() == 1:
            my_member = MemberDetailSerializer(_member[0])
            detail['member'] = my_member.data
        else:
            detail['member'] = None
        if _member.count() == 1:
            if _member.last().is_active:
                member_current = _member[0]
                roles = member_current.role.all().values()
                member_roles = [role["name"] for role in roles]
                if "ADMIN" in member_roles:
                    if project_detail_admin_check(pk):
                        detail['member'].update({'validate_available': True})
                    else:
                        detail['member'].update({'validate_available': False})

                if "LABELER" in member_roles:
                    queue_label_id, label_available, num_queue_rejected = project_detail_labeler_check(pk, member_current)
                    detail['member'].update({
                        'queue_label_id': queue_label_id,
                        'label_available': label_available,
                        'num_queue_rejected': num_queue_rejected
                    })
                    
                if "REVIEWER" in member_roles:
                    queue_review_id, review_available = project_detail_reviewer_check(pk, member_current, db_projectstt.queue_size)
                    detail['member'].update({'review_available': review_available})
                    detail['member'].update({'queue_review_id': queue_review_id})
                else:
                    detail['member'].update({'review_available': False})
                    detail['member'].update({'queue_review_id': None})
            else:
                detail['member'].update({
                    'review_available': False,
                    'label_available': False,
                    'queue_review_id': None,
                    'queue_label_id': None
                    })
        return Response(detail, status=status.HTTP_200_OK)
class ProjectDelete(DestroyAPIView):
    """Delete a project"""
    queryset = Projects.objects.all()

    def delete(self, request, pk):
        queryset = Projects.objects.get(id = pk)
        queryset.delete()
        return Response(status=status.HTTP_202_ACCEPTED)

class ProjectConfig(CreateAPIView):
    """Setting for project"""
    serializer_class = ProjectSettingSerializer

class ChangeSettingProject(UpdateAPIView):
    serializer_class = ProjectSettingSerializer
    def update(self, request, pk):
        queryset = ProjectSetting.objects.get(id = pk)
        old_overlap_percent = queryset.overlap_percent
        old_review_percent = queryset.review_percent
        old_queue_size = queryset.queue_size  
        data_update = ast.literal_eval(request.body.decode("UTF-8"))
        queryset.overlap_enable = data_update.get('overlap_enable')
        overlap_percent = queryset.overlap_percent = data_update.get('overlap_percent')
        queryset.overlap_time = data_update.get('overlap_time')
        queryset.review_enable = data_update.get('review_enable')
        queryset.review_percent = data_update.get('review_percent')
        queue_size = queryset.queue_size = data_update.get('queue_size')
        queryset.save()

class MyProjects(ListAPIView):
    serializer_class = ProjectSearchSerializer
    filterset_class = ProjectFilter
    def get_queryset(self):
        user_id = self.request.user.id
        queryset = Projects.objects.prefetch_related("member_set")\
            .filter(member__user_id = user_id, member__status = "JOINED")
        return queryset

class FinishCreateProject(views.APIView):
    def post(self, request, pk):
        db_project = Projects.objects.get(id = pk)
        project_id = db_project.id
        error = project_finish(project_id)
        if error != []:
            return Response({"Error":error}, status=status.HTTP_400_BAD_REQUEST)
        db_project.status = "ANNOTATION"
        db_project.save()
        return Response(status=status.HTTP_201_CREATED)

class ProjectOverviewFilter(filters.FilterSet):
    member_id = filters.NumberFilter(field_name='member_id', lookup_expr="icontains")
    
class ProjectOverview(GenericAPIView):
    serializer_class = WorkItemSerializer
    filterset_class = ProjectOverviewFilter
    ordering_fields = ("member_id")
    queryset = WorkItem.objects.all()
    def get(self, request, pk):
        project_id = pk
        member_id = self.request.query_params.get('member_id')
        review = project_overview(project_id, member_id)
        return Response(review, status=status.HTTP_200_OK)

list_project = ProjectList.as_view()
create_project = ProjectCreate.as_view()
update_project = ProjectUpdate.as_view()
delete_project = ProjectDelete.as_view()
detail_project = ProjectDetail.as_view()
setting_project = ProjectConfig.as_view()
list_anno_project = ProjectAnnotationList.as_view()
my_projects = MyProjects.as_view()
finish_create_project = FinishCreateProject.as_view()
review_project = ProjectOverview.as_view()

##################################################################################################
##################################################################################################
##################  DATASETS ##################

class AttachDataset(serializers.Serializer):
    dataset_id = serializers.IntegerField(required = True)
    project_id = serializers.IntegerField(required = True)
    class Meta:
        fields = ('project_id','dataset_id')

class DetachDataset(serializers.Serializer):
    dataset_id = serializers.IntegerField(required = True)
    project_id = serializers.IntegerField(required = True)
    class Meta:
        fields = ('project_id','dataset_id')
class Attach(GenericAPIView):
    """
    key: 
          Attach from project to dataset: project_to_dataset
          Attach from dataset to project: dataset_to_project 
    """
    serializer_class = AttachDataset
    @swagger_auto_schema(operation_description="""Attach dataset into project""")
    def post(self, request):
        data_attach = ast.literal_eval(request.body.decode("UTF-8"))
        check = attach_dataset(data_attach)
        if not check:
            Response({"error":{"message": "Project not finish config"}})
        
        return Response(data_attach, status=status.HTTP_202_ACCEPTED)
    
class Detach(GenericAPIView):
    serializer_class = DetachDataset
    @swagger_auto_schema(operation_description="""Detach dataset from project""")
    def post(self, request):
        data_detach = ast.literal_eval(request.body.decode("UTF-8"))
        proj = Projects.objects.get(id = data_detach.get('project_id'))
        datas = Dataset.objects.get(id = data_detach.get('dataset_id'))
        proj.dataset_list.remove(datas)
        proj.save()
        serializer = DatasetSerializer(datas)
        return Response(serializer.data,status=status.HTTP_202_ACCEPTED)

attach = Attach.as_view()
detach = Detach.as_view()


class DatasetListPaginator(PageNumberPagination):
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

class DatasetList(ListAPIView):
    serializer_class = DatasetSearchSerializer
    queryset = Dataset.objects.all().order_by('-id')
    pagination_class = DatasetListPaginator
# Dataset
class DatasetCreate(CreateAPIView):
    """Create a new Dataset"""
    serializer_class = DatasetSerializer

class DatasetUpdate(UpdateAPIView):
    """Update Dataset"""
    serializer_class = DatasetSerializer
    queryset = Dataset.objects.all()

    def update(self, request, pk):
        queryset = Dataset.objects.get(id = pk)
        data_update = ast.literal_eval(request.body.decode("UTF-8"))
        queryset.name = data_update.get('name')
        queryset.status = data_update.get('status')
        queryset.save()
        return Response(status=status.HTTP_202_ACCEPTED)

class DatasetDelete(DestroyAPIView):
    """Delete a Dataset"""
    queryset = Dataset.objects.all()

    def delete(self, request, pk):
        queryset = Dataset.objects.get(id = pk)
        queryset.delete()
        return Response(status=status.HTTP_202_ACCEPTED)

class DatasetDetail(ListAPIView):
    serializer_class = DatasetSearchSerializer
    def get(self, request, pk):
        queryset = Dataset.objects.get(id=pk)
        serializer = DatasetSearchSerializer(queryset)
        return Response(serializer.data, status=status.HTTP_200_OK)

list_dataset = DatasetList.as_view()
create_dataset = DatasetCreate.as_view()
update_dataset = DatasetUpdate.as_view()
delete_dataset = DatasetDelete.as_view()
detail_dataset = DatasetDetail.as_view()

##################################################################################################
##################################################################################################
##################  MEMBERS ##################

class MemberList(ListAPIView):
    serializer_class = MemberDetailSerializer
    def get_queryset(self):
        queryset = Member.objects.all()
        return queryset



class MemberCreate(GenericAPIView):
    serializer_class = MemberSerializer
    @swagger_auto_schema(operation_description=
    """Create Member
    Key: request: member join project
    invite: admin invite member join project
    """)
    def post(self, request):
        user_id = request.user.id
        validated_data = ast.literal_eval(request.body.decode("UTF-8"))
        member_invite = admin_invite_user(validated_data)
        if not member_invite:
            return Response({"error": {"message": "Member is exist"}}, status=status.HTTP_409_CONFLICT)
        serializer = MemberSerializer(member_invite)
        return Response(serializer.data, status=status.HTTP_200_OK)

class MemberRequest(GenericAPIView):
    serializer_class = MemberSerializer
    def post(self, request):
        data = ast.literal_eval(request.body.decode("UTF-8"))
        user_id = request.user.id
        member_request = member_request_project(data, user_id)
        if not member_request:
            return Response({"error": {"message": "Member is exist"}}, status=status.HTTP_409_CONFLICT)
        serializer = MemberSerializer(member_request)
        return Response(serializer.data, status=status.HTTP_200_OK)

class MemberJoin(serializers.Serializer):
    project_id = serializers.IntegerField(required=True)
    status = serializers.CharField(required=True)
    class Meta:
        models = Member
        fields = ('id', 'project_id')

class AdminAcceptMemberSerializer(serializers.Serializer):
    project_id = serializers.CharField(required = True)
    user_id = serializers.IntegerField(required=True)
    status = serializers.CharField(required = True)
class AdminApceptMember(GenericAPIView):
    serializer_class = AdminAcceptMemberSerializer
    @swagger_auto_schema(operation_description="""Admin Apcept Member""")
    def post(self, request):
        user_id = request.user.id
        data = ast.literal_eval(request.body.decode("UTF-8"))
        resp = accept_member(data, user_id)
        if resp:
            return Response(resp,status=status.HTTP_202_ACCEPTED)
        else:
            return Response({"error":{"message":"You isn't admin"}}, status=status.HTTP_409_CONFLICT)

class MemberJoinProject(GenericAPIView):
    serializer_class = MemberJoin
    @swagger_auto_schema(operation_description="""Member Join Project""")
    def post(self, request):
        data = ast.literal_eval(request.body.decode("UTF-8"))
        user_id = request.user.id
        member = member_join(data, user_id)
        return Response(MemberSerializer(member).data,status=status.HTTP_202_ACCEPTED)

class ActivationMemberSerializer(serializers.Serializer):
    member_id = serializers.IntegerField(required=True)
    is_active = serializers.BooleanField(required=True)
class ActivationMember(GenericAPIView):
    serializer_class = ActivationMemberSerializer
    def post(self, request):
        data = json.loads(request.body)
        deactivate_member(data)
        return Response(data, status=status.HTTP_200_OK)

class MemberListProject(views.APIView):
    def get(self,request):
        user_id = request.user.id
        queryset = Member.objects.filter(user_id=user_id, status='INVITED')
        serializer = MemberSerializer(queryset, many=True)
        result = []
        for seri in serializer.data:
            result.append(dict(seri))
        return Response(result)

class MemberDelete(DestroyAPIView):
    serializer_class = MemberSerializer
    queryset = Member.objects.all()
    def delete(self, request, pk):
        query = Member.objects.get(id = pk)
        db_workitem = WorkItem.objects.prefetch_related('memberworkitem_set')\
            .filter(memberworkitem__member_id=pk)
        for workitem in db_workitem:
            workitem.status = 'ANNOTATION'
            workitem.save()
        _user = query.user
        db_project = query.project
        to_email = _user.email
        if to_email not in [None, ""]:
            subject = "Trada Notification"
            message = """
            Dear {},

            You don't contribute to the project {} for a long time or the quality of your label very bad.
            We apologize for removing you from this project.
            Please contact the admin of the project for more information. 
            You can find other projects at: https://trada.nccsoft.vn/i/f/explore .
            
            Thank you.
            Trada Dev team.
            """.format(_user.first_name, db_project.name)
            message = textwrap.dedent(message)
            email_from = settings.EMAIL_HOST_USER
            recipient_list = [to_email]
            send_mail(subject, message, email_from, recipient_list)
        query.delete()
        return Response(status=status.HTTP_202_ACCEPTED)

class MemberInProject(ListAPIView):
    serializer_class = MemberDetailSerializer
    queryset = Member.objects.all()

    def get_queryset(self):
        print(self.kwargs['pk'])
        queryset = Member.objects.filter(project_id=self.kwargs['pk'])
        return queryset

class ChangeRole(GenericAPIView):
    serializer_class = ChangeRoleSerializer
    def post(self, request):
        data = ast.literal_eval(request.body.decode("UTF-8"))
        member_id = data.get("member_id")
        action = data.get("action")
        role = data.get("role")
        db_member = Member.objects.get(id=member_id)
        db_role = ProjectRole.objects.get(name=role.upper())
        if action == "add":
            db_member.role.add(db_role)
        elif action=="remove":
            db_member.role.remove(db_role)
        return Response(data, status=status.HTTP_202_ACCEPTED)

list_member = MemberList.as_view()
create_member = MemberCreate.as_view()
admin_accept_member = AdminApceptMember.as_view()
member_join_project = MemberJoinProject.as_view()
member_list_project = MemberListProject.as_view()
member_in_project = MemberInProject.as_view()
delete_member = MemberDelete.as_view()
join_request = MemberRequest.as_view()
activation_member = ActivationMember.as_view()
member_change_role = ChangeRole.as_view()
class RequestQueue(views.APIView):
    def post(self, request, pk):
        member_id = pk
        db_member = Member.objects.get(id = member_id)
        roles = db_member.role.all().values()
        member_roles = [role["name"] for role in roles]
        if "LABELER" not in member_roles:
            return Response({"error":{"message": "You are'nt Labeler"}})
        project_id = db_member.project_id
        projectstt = ProjectSetting.objects.get(project_id=project_id)
        db_queue = QueueMember.objects.filter(member_id=member_id, project_id=project_id, status="ANNOTATION")
        if db_queue.count() > 0:
            return Response({"error":{"message":"Exist queue need label"}, "queue_label_id":db_queue[0].id},status=status.HTTP_412_PRECONDITION_FAILED)
        queue_size = projectstt.queue_size
        list_work_current = WorkItem.objects.prefetch_related('memberworkitem_set')\
            .filter(memberworkitem__member_id=member_id, project_id=project_id, memberworkitem__role="LABELER").values_list('row_id')
        _list_work = []
        for ids in list_work_current:
            _list_work.append(ids[0])
        db_workitem = WorkItem.objects.filter(~Q(row_id__in=_list_work), project_id=project_id, status = 'ANNOTATION').values_list('row_id')
        list_row = []
        for work in db_workitem:
            list_row.append(work[0])
        list_row = list(set(list_row))
        if len(list_row) > queue_size:
            list_row_id = np.random.choice(list_row, queue_size, replace=False).tolist()
        elif len(list_row) == 0:
            return Response(status=status.HTTP_409_CONFLICT)
        else:
            list_row_id = list_row
        serializer = {'WorkItem': []}
        db_queuemember = QueueMember.objects.create(
            member_id = member_id,
            size_item = len(list_row_id),
            status = "ANNOTATION",
            project_id = project_id,
        )
        list_mb_workitem = []
        rv_add = 0
        for row_id in list_row_id:
            workitem = WorkItem.objects.filter(project_id=project_id, row_id=row_id, status="ANNOTATION").last()
            mbwi = MemberWorkItem.objects.create(member_id=member_id, workitem=workitem, status='PENDING', queue=db_queuemember, role="LABELER")
            _mbwi_review = MemberWorkItem.objects.filter(role="REVIEWER", workitem=workitem, status="PENDING").count()
            workitem.status = 'PENDING'
            workitem.save()
            if _mbwi_review == 0:
                list_mb_workitem.append(mbwi)
            else:
                rv_add += 1
            serializer['WorkItem'].append(WorkItemSerializer(workitem).data)

        review_percent = projectstt.review_percent
        review_vote = projectstt.review_vote
        num_review = len(list_mb_workitem)*review_percent//100 - rv_add
        num_review = num_review if num_review > 0 else 0
        list_row_review = np.random.choice(list_mb_workitem, num_review, replace=False).tolist()*review_vote
        for row_review in list_row_review:
            MemberWorkItem.objects.create(member=None, workitem=row_review.workitem, status="PENDING", role="REVIEWER")
        return Response({"queue_label_id": db_queuemember.id}, status=status.HTTP_201_CREATED)

request_workitem = RequestQueue.as_view()


