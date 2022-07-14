from backend.apps.validator.models import WorkItemVote
from backend.apps.cms.models import *
from backend.apps.distributor.models import *
from backend.apps.editor.models import *
from backend.apps.annotator.models import *
from backend.apps.cms.serializers import *
from backend.apps.logger.models import ActivityLog
from django.db.models import query, fields, Q, Count
from rest_framework.generics import *
from rest_framework.views import *
from rest_framework.response import Response
from rest_framework import serializers, status
import ast
from django.core.validators import DecimalValidator, validate_integer, ValidationError
import numpy as np
class ActionWorkItemSerializer(serializers.Serializer):
    action = serializers.CharField(required=True)
    workitem_id = serializers.IntegerField(required=False)
    queue_id = serializers.IntegerField(required=False, validators=[validate_integer(2)])

class ActionWorkItem(GenericAPIView):
    serializer_class = ActionWorkItemSerializer
    def post(self, request):
        body = ast.literal_eval(request.body.decode("UTF-8"))
        queue_id = body.get("queue_id")
        action = body.get("action")
        if type(queue_id) == int and queue_id > 0:
            db_workitems = WorkItem.objects.prefetch_related("memberworkitem_set")\
                .filter(memberworkitem__queue_id = queue_id)
            member = Member.objects.get(queuemember__id=queue_id)
            member.save()
            for workitem in db_workitems:
                if action == "accept":
                    workitem.status = "COMPLETED"
                    workitem.save()
                    workitem_log, _ = ActivityLog.objects.update_or_create(
                        object = "WORK_ITEM",
                        value = {},
                        member = member, 
                        project_id = member.project_id,
                        user_id = request.user.id,
                        workitem = workitem
                    )
                    workitem_log.action = "ACCEPTED"
                    db_queue = QueueMember.objects.get(id=queue_id)
                    db_queue.status = "COMPLETED"
                    db_queue.save()
                else:
                    workitem.status = "REJECTED"
                    mbw = workitem.memberworkitem_set.get(role="LABELER", status__in=["SUBMITED", "SKIPPED", "PENDING"])
                    mbw.status = "PENDING"
                    mbw.save()
                    workitem.save()
                    workitem_log, _ = ActivityLog.objects.update_or_create(
                        object = "WORK_ITEM",
                        value = {},
                        member = member, 
                        project_id = member.project_id,
                        user_id = request.user.id,
                        workitem = workitem
                    )
                    workitem_log.action = "REJECTED"
                    db_queue = QueueMember.objects.get(id=queue_id)
                    db_queue.status = "REJECTED"
                    db_queue.save()
                    member.total_rejected += len(db_workitems)
                    member.save()
                workitem_log.save()
        else:
            workitem_id = body.get("workitem_id")
            workitem = WorkItem.objects.get(id=workitem_id)
            db_queue = workitem.memberworkitem_set.get(role="LABELER", status__in=["SUBMITED", "PENDING", "SKIPPED"],).queue
            if action == "accept":
                workitem.status = "COMPLETED"
                workitem.save()
                _mbwi = workitem.memberworkitem_set.get(role="LABELER", status__in=["SUBMITED", "PENDING","SKIPPED"])
                _mbwi.status = "SUBMITED"
                _mbwi.save()
                _workitems = WorkItem.objects.prefetch_related('memberworkitem_set')\
                            .filter(memberworkitem__queue_id= db_queue.id, status="REJECTED")
                if _workitems.count() > 0:
                    db_queue.status = "REJECTED"
                else:
                    db_queue.status = "VALIDATION"
            else:
                workitem.status = "REJECTED"
                workitem.save()
                db_queue.status = "REJECTED"
                mbw = workitem.memberworkitem_set.get(role="LABELER", status__in=["SUBMITED","SKIPPED"])
                mbw.status = "PENDING"
                mbw.save()
                member = mbw.member
                member.total_rejected += 1
                member.save()
            member = db_queue.member
            workitem_log, _ = ActivityLog.objects.update_or_create(
                        object = "WORK_ITEM",
                        value = {},
                        member = member, 
                        project_id = member.project_id,
                        user_id = request.user.id,
                        workitem = workitem
                    )
            workitem_log.action = "ACCEPTED" if workitem.status == "COMPLETED" else "REJECTED"
            workitem_log.save()
            db_queue.save()
            
            db_workitems = WorkItem.objects.prefetch_related('memberworkitem_set')\
                    .filter(
                        memberworkitem__queue_id= db_queue.id,
                        memberworkitem__role="LABELER", 
                        status__in=["COMPLETED", "REJECTED"],
                        )
            if db_workitems.count() == db_queue.submited_item + db_queue.skipped_item:
                _workitems = WorkItem.objects.prefetch_related('memberworkitem_set')\
                        .filter(memberworkitem__queue_id= db_queue.id, status="REJECTED")
                if _workitems.count() > 0:
                    db_queue.status = "REJECTED"
                else:
                    db_queue.status = "COMPLETED"
                db_queue.save()
            
        return Response(status=status.HTTP_200_OK)

class VerifyBoxesWorkItemSerializer(serializers.Serializer):
    score = serializers.IntegerField(required=True)
    labeleditem_id = serializers.IntegerField(required=True)
    member_id = serializers.IntegerField(required=True)
    trust_score = serializers.IntegerField(required=False)
class VerifyBoxWorkItem(GenericAPIView):
    serializer_class = VerifyBoxesWorkItemSerializer
    def post(self, request):
        body = ast.literal_eval(request.body.decode("UTF-8"))
        labeleditem_id = body.get("labeleditem_id")
        score = body.get("score")
        member_id = body.get("member_id")
        trust_score = body.get("trust_score")
        labeleditem = LabeledItem.objects.get(id=labeleditem_id)
        workitem = labeleditem.workitem
        body.update({
            "workitem_id": workitem.id 
        })
        workitem_vote, created = WorkItemVote.objects.update_or_create(member_id=member_id, labeleditem_id=labeleditem_id)
        workitem_vote.score = score
        workitem_vote.save()
        logger, created = ActivityLog.objects.update_or_create(
            object = "LABELED_ITEM",
            action = "REVIEWED",
            label_id = labeleditem.label_id,
            labeleditem_id = labeleditem_id,
            member_id = member_id,
            project_id = labeleditem.workitem.project_id,
            user_id = workitem_vote.member.user_id,
            workitem = workitem
        )
        logger.value = {"score": score, "trust_score": trust_score}
        logger.save()
        if trust_score not in [0, None]:
            db_labeleditem = LabeledItem.objects.get(id=labeleditem_id)
            db_labeleditem.trust_score = trust_score
            db_labeleditem.save()
        db_labeleditem = LabeledItem.objects.filter(workitem=workitem)
        db_workitemvote = WorkItemVote.objects.filter(member_id=member_id, labeleditem__in=db_labeleditem)
        
        if db_labeleditem.count() == db_workitemvote.count():
            mbwi = workitem.memberworkitem_set.get(status__in=["REVIEWING","REVIEWED"], member_id=member_id)
            mbwi.status = "REVIEWED"
            mbwi.save()
            workitem_log, _ = ActivityLog.objects.update_or_create(
                object = "WORK_ITEM",
                action = "REVIEWED",
                member_id = member_id,
                project_id = workitem.project_id,
                user_id = mbwi.member.user_id,
                workitem = workitem
            )
            w_score_like = db_workitemvote.filter(score=1).count()
            workitem_log.value = {"score": round(w_score_like*100/db_workitemvote.count(), 2)}
            workitem_log.save()

            queue_review = mbwi.queue
            mbwi_reviewed = MemberWorkItem.objects.filter(queue=queue_review, status="REVIEWED").count()
            mbwi_reviewing = MemberWorkItem.objects.filter(queue=queue_review, status="REVIEWING").count()
            _mbwi = workitem.memberworkitem_set.filter(status__in=["REVIEWING","PENDING"])
            if _mbwi.count() == 0:
                workitem.status = "VALIDATION"
                workitem.save()
                db_queue = workitem.memberworkitem_set.get(role="LABELER", status="SUBMITED").queue
                workitem_id = db_queue.memberworkitem_set.filter(~Q(status="SKIPPED")).values_list('workitem_id')
                workitem_all = WorkItem.objects.filter(id__in=workitem_id)
                mbwi_review = MemberWorkItem.objects.filter(workitem__in=workitem_all, role="REVIEWER", status__in=["PENDING","REVIEWING"]).count()
                if mbwi_review == 0:
                    db_queue.status = "VALIDATION"
                    db_queue.save()
            if mbwi_reviewed == queue_review.size_item or mbwi_reviewing == 0:
                queue_review.status = "REVIEWED"
                queue_review.save()
                return Response(body, status=status.HTTP_202_ACCEPTED)
        return Response(body, status=status.HTTP_200_OK)

class RandomWorkItemReview(APIView):
    def post(self, request, pk):
        user_id = request.user.id
        member_id = pk
        member = Member.objects.get(id=member_id)
        roles = member.role.all().values()
        member_roles = [role["name"] for role in roles]
        if "REVIEWER" not in member_roles:
            return Response({"error":{"message": "You aren't Reviewer"}}, status=status.HTTP_409_CONFLICT)
        project_id = member.project_id
        queue_reviewing = QueueMember.objects.filter(project_id=project_id, member_id=member_id, status="REVIEWING")
        if queue_reviewing.count() > 0:
            ids = queue_reviewing.last().id
            return Response({
                "error": {"message": "Exist queue need review",},
                "queue_review_id": ids
            }, status=status.HTTP_412_PRECONDITION_FAILED)
        projectst = ProjectSetting.objects.get(project_id=project_id)
        review_percent = projectst.review_percent
        queue_size = projectst.queue_size
        mine_workitem_id = MemberWorkItem.objects.filter(
                    member_id=member.id,
                    role__in=["LABELER","REVIEWER"]).values_list('workitem_id',)
        db_mbworkitem = MemberWorkItem.objects\
                .filter(~Q(workitem_id__in = mine_workitem_id),
                        workitem__project_id=project_id,
                        status="PENDING",
                        role="REVIEWER")
        list_mb_workitems = []
        check_id = []
        for mbworkitem in db_mbworkitem:
            if mbworkitem.workitem_id not in check_id:
                list_mb_workitems.append(mbworkitem)
                check_id.append(mbworkitem.workitem_id)
        if len(list_mb_workitems) == 0:
            return Response({"error":{"message":"Have not workitem to review"}},status=status.HTTP_409_CONFLICT)
        elif len(list_mb_workitems) < queue_size:
            _wi = WorkItem.objects.filter(
                ~Q(id__in=mine_workitem_id),
                project_id=project_id,
                status__in = ["ANNOTATION", "PENDING"],
            )
            if  _wi.count() != 0:
                return Response({"error":{"message":"Have not workitem to review"}},status=status.HTTP_409_CONFLICT)
            else:
                mbworkitems_random = list(list_mb_workitems)
        else:
            mbworkitems_random = np.random.choice(list_mb_workitems, queue_size, replace=False).tolist()
        
        queue_review = QueueMember.objects.create(
            member_id = member.id,
            project_id = project_id,
            status = "REVIEWING",
            size_item = len(mbworkitems_random),
        )
        for mbworkitem in mbworkitems_random:
            mbworkitem.status = "REVIEWING"
            mbworkitem.member_id = member.id
            mbworkitem.queue_id = queue_review.id
            mbworkitem.save()

        return Response({"queue_review_id": queue_review.id},status=status.HTTP_200_OK)


verifybox_workitem = VerifyBoxWorkItem.as_view()
action_workitem = ActionWorkItem.as_view()
get_review = RandomWorkItemReview.as_view()
