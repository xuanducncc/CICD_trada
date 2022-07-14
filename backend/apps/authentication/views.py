from backend.apps.validator.models import WorkItemVote
from backend.apps.annotator.models import LabeledItem
from backend.apps.cms.models import Projects
from backend.apps.distributor.models import WorkItem
from rest_framework import permissions, serializers, status
from rest_framework.generics import CreateAPIView, ListAPIView, GenericAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer
from .models import *
import ast
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.pagination import PageNumberPagination
class UserCreate(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    serializer_class = UserSerializer
    def post(self, request):
        validated_data= ast.literal_eval(request.body.decode("UTF-8"))
        password = validated_data.pop('password', None)
        email = validated_data.get('email')
        username = validated_data.get('username')
        google_token = validated_data.get('google_token')
        print(email, username)
        _name = User.objects.filter(username=username)
        if _name.count() > 0:
            return Response({"error":{"message":"Username is exist"}}, status=status.HTTP_409_CONFLICT)
        _email = User.objects.filter(email=email)
        if _email.count() > 0:
            return Response({"error":{"message":"Email is exist"}}, status=status.HTTP_409_CONFLICT)
        instance = User.objects.create(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        serializer = UserSerializer(instance)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


user_create = UserCreate.as_view()

class Protected(APIView):
    def get(self, request):
        return Response(data={'type': 'protected'})

class UserListPaginator(PageNumberPagination):
    page_size_query_param = 'page_size'
    max_page_size = 100
    def get_paginated_response(self, data):
        return Response(data
        , headers={
            "Pagination-Count": self.page.paginator.count,
            "Pagination-Page": self.page.number,
            "Pagination-Limit": self.page.paginator.num_pages
        })

class UserList(ListAPIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    serializer_class = UserSerializer
    pagination_class = UserListPaginator
    queryset = User.objects.all()

class InfoUser(APIView):
    def get(self, request, pk):
        user_id = pk
        db_user = User.objects.get(id = pk)
        serializer = UserSerializer(db_user)
        total_project = Projects.objects.filter(member__user_id= pk, status="ANNOTATION", member__status="JOINED")
        total_workitem = WorkItem.objects.filter(status="COMPLETED", memberworkitem__member__user_id= pk, 
                memberworkitem__role="LABELER")
        total_labeleditem = LabeledItem.objects.filter(workitem__in=total_workitem)
        total_liked = WorkItemVote.objects.filter(labeleditem__in=total_labeleditem, score=1)
        results = serializer.data
        results.update(
            {
                "total_project": total_project.count(),
                "total_workitem": total_workitem.count(),
                "total_labeleditem": total_labeleditem.count(),
                "total_liked": total_liked.count()
            }
        )
        return Response(results, status=status.HTTP_200_OK)

class UserCurrent(APIView):
    def get(self, request):
        user_id = request.user.id
        db_user = User.objects.get(id=user_id)
        serializer = UserSerializer(db_user)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
protected = Protected.as_view()
user_list = UserList.as_view()
user_current = UserCurrent.as_view()
user_info = InfoUser.as_view()

class SendMailSerializer(serializers.Serializer):
    to_email = serializers.CharField(required=True)

class SendMail(GenericAPIView):
    serializer_class = SendMailSerializer
    def post(self, request):
        validated_data= ast.literal_eval(request.body.decode("UTF-8"))
        to_email = validated_data.get("to_email")
        print(to_email)
        subject = 'Thank you for registering to our site'
        message = ' it  means a world to us '
        email_from = settings.EMAIL_HOST_USER
        recipient_list = [to_email]
        send_mail( subject, message, email_from, recipient_list )

        return Response(status=status.HTTP_200_OK)

send_email = SendMail.as_view()