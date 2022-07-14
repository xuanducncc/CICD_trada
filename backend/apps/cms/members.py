from django.db.models import Q
from backend.apps.distributor.models import MemberWorkItem, QueueMember, WorkItem
from datetime import datetime
from django.conf import settings
from django.core.mail import send_mail
from backend.apps.cms.models import Member, ProjectRole, Projects
from backend.apps.authentication.models import User
import threading


def server_send_email(subject, message, recipient_list):
    email_from = settings.EMAIL_HOST_USER
    thread = threading.Thread(target=send_mail,args=(subject, message, email_from, recipient_list,))
    thread.start()

def admin_invite_user(validated_data):
    project_id = validated_data.get('project_id')
    user = User.objects.get(id=validated_data.get('user_id'))
    roles = validated_data.pop('role')
    member_roles = [role["name"] for role in roles]
    member = Member.objects.filter(
        user=user,
        project_id=project_id,
        role__name__in=member_roles
    )
    if not member.count():
        validated_data.update({'status': 'INVITED'})
        member_invite = Member.objects.create(**validated_data)
        member_invite.role.set(ProjectRole.objects.filter(name__in=member_roles))
        project = Projects.objects.get(id=project_id)
        subject = "Admin project {} invited you".format(project.name)
        message = """
        Dear {},

        Admin is writing to invite you join the project "{}" .
        You can accept or decline this invitation. You can visit https://trada.nccsoft.vn/i/projects/{}/overview to see overview of project.
        Please contact us: autobot.trada@gmail.com if you have any questions.

        Happy labeling.
        Trada Dev team.
        """.format(user.first_name, project.name, project.id)
        recipient_list = [user.email]
        server_send_email(subject, message, recipient_list)

        return member_invite
    else:
        return None
        
def member_request_project(validated_data, user_id):
    project_id = validated_data.get("project_id")
    roles = validated_data.pop('role')
    member_roles = [role["name"] for role in roles]
    member = Member.objects.filter(user_id=user_id, project_id=project_id, role__name__in=member_roles)
    if not member.count():
        member_request = Member.objects.create(user_id = user_id, status = 'REQUESTED', project_id = project_id)
        member_request.role.set(ProjectRole.objects.filter(name__in=member_roles))
        db_user = User.objects.get(id=user_id)
        project = Projects.objects.get(id = project_id)
        subject = "User Request Join Project"
        message = "User \"{}\"  request join to project \"{}\"".format(db_user.username, project.name)
        user_admin = project.owner
        recipient_list = [user_admin.email]
        server_send_email(subject, message, recipient_list)

        return member_request
    else:
        return None

def accept_member(validated_data, user_id):
    project_id = validated_data.get('project_id')
    user_rq_id = validated_data.get('user_id')
    user_request = User.objects.get(id=user_rq_id)
    status = validated_data.get('status')
    user = User.objects.get(id=user_id)
    project = Projects.objects.get(id=project_id)
    member = Member.objects.get(project_id=project_id, user_id=user_request)
    if project.owner_id == user_id and user.is_superuser:
        if status.lower() == "accept":
            member.status = "JOINED"
            member.join_date = datetime.now()
            member.save()
            subject = "Your request to {}".format(project.name)
            message = """
            Dear {},

            Your request to project "{}" has been "Accepted".
            Now, you can start contribute to the project: https://trada.nccsoft.vn/i/projects/{}/overview .
            Please contact us: autobot.trada@gmail.com if you have any questions.

            Happy labeling.
            Trada Dev team.
            """.format(user_request.first_name, project.name, project.id)

        elif status.lower() == "reject":
            member.status = "REJECTED"
            member.save()
            subject = "Your request to {}".format(project.name)
            message = """
            Dear {},

            Your request to project "{}" has been "Rejected".
            Please contact admin of project for more information. 
            You can find other projects at: https://trada.nccsoft.vn/i/f/explore .
            
            Thank you.
            Trada Dev team.
            """.format(user_request.first_name, project.name)
        recipient_list = [user_request.email]
        server_send_email(subject, message, recipient_list)
        validated_data['member_id'] = member.id
        return validated_data
    else:
        return None
    
def member_join(validated_data, user_id):
    project_id = validated_data.get("project_id")
    status = validated_data.get("status")
    member = Member.objects.get(project_id=project_id, user_id=user_id)
    if status.lower() == "accept":
        member.status = "JOINED"
        member.join_date = datetime.now()
    elif status.lower() == "reject":
        member.status = "REJECTED"
    member.save()
    return member

def deactivate_member(validated_data):
    member_id = validated_data.get("member_id")
    is_active = validated_data.get("is_active")
    member = Member.objects.get(id=member_id)
    project = member.project
    user = member.user
    if is_active:
        member.is_active = True
        member.save()
        subject = "Account activation in the project {}".format(project.name)
        message = """
        Dear {},

        Your account has been activated.
        Now, you can start contribute to the project: https://trada.nccsoft.vn/i/projects/{}/overview .
        Please contact us: autobot.trada@gmail.com if you have any questions.

        Happy labeling.
        Trada Dev team.
        """.format(user.first_name, project.name, project.id)
        recipient_list = [user.email]
        server_send_email(subject, message, recipient_list)
    else:
        member.is_active = False
        mbwi_reviews = MemberWorkItem.objects.filter(member=member, role="REVIEWER", status="REVIEWING")
        id_queue_reviews = list(review[0] for review in mbwi_reviews.values_list("queue_id").distinct())
        for id_queue_review in id_queue_reviews:
            queue_member = QueueMember.objects.get(id=id_queue_review)
            mbwi_reviewed = MemberWorkItem.objects.filter(member=member, queue_id=id_queue_review, status="REVIEWED").count()
            if mbwi_reviewed:
                queue_member.status = "REVIEWED"
                queue_member.size_item = mbwi_reviewed
                queue_member.save()
            else:
                queue_member.delete()
        for mbwi_review in mbwi_reviews:
            mbwi_review.member_id = None
            mbwi_review.queue_id = None
            mbwi_review.status = "PENDING"
            mbwi_review.save()
        
        mbwi_labels = MemberWorkItem.objects.filter(~Q(workitem__status="COMPLETED"), member=member, role="LABELER")
        workitems = WorkItem.objects.prefetch_related("memberworkitem_set").filter(memberworkitem__in=mbwi_labels).distinct()
        for workitem in workitems:
            workitem.status = "ANNOTATION"
            workitem.save()
        id_queue_label = list(label[0] for label in mbwi_labels.values_list("queue_id").distinct())
        _queue_del = QueueMember.objects.filter(~Q(status="REJECTED"), id__in=id_queue_label)
        if _queue_del.count():
            _queue_del.delete()
        queue_rejects = QueueMember.objects.filter(status="REJECTED", id__in=id_queue_label)
        for queue_reject in queue_rejects:
            wi_comp = WorkItem.objects.filter(status="COMPLETED", memberworkitem__queue=queue_reject)
            if wi_comp.count():
                queue_reject.size_item = wi_comp.count()
                queue_reject.status = "COMPLETED"
                queue_reject.save()
            else:
                queue_reject.delete()
        _mb_del = MemberWorkItem.objects.filter(workitem__id__in=mbwi_labels.values_list("workitem__id"), role="REVIEWER", status="PENDING")
        if _mb_del.count():
            _mb_del.delete()
        reviews = MemberWorkItem.objects.filter(workitem__id__in=mbwi_labels.values_list("workitem__id"), role="REVIEWER", status__in=["REVIEWED","REVIEWING"])
        for review in reviews:
            _queue = review.queue
            _queue.size_item -= 1
            if _queue.size_item == 0:
                _queue.delete()
            else:
                st_queue = MemberWorkItem.objects.filter(queue_id=_queue.id, role="REVIEWER", status="REVIEWING").count()
                if not st_queue:
                    _queue.status = "REVIEWED"
                _queue.save()
            review.delete()
        subject = "Trada Notification"
        message = """
        Dear {},

        You don't contribute to the project {} for a long time or the quality of your label very bad.
        We apologize for deactivate you from this project.
        Please contact the admin of the project for more information. 
        You can find other projects at: https://trada.nccsoft.vn/i/f/explore .

        Happy labeling.
        Trada Dev team.
        """.format(user.first_name, project.name)
        recipient_list = [user.email]
        server_send_email(subject, message, recipient_list)
        member.save()

