from backend.apps.annotator.models import LabeledItem
from backend.apps.logger.models import ActivityLog
from backend.apps.validator.models import WorkItemVote
from distributor.distributor import Generate
from django.db.models.aggregates import Avg, Sum
from backend.apps.uploader.models import Image
from copy import error
from backend.apps.editor.models import Editor, Label
from backend.apps.distributor.models import MemberWorkItem, QueueMember, WorkItem
from django.db.models import Q
from backend.apps.cms.models import Dataset, Projects, Member, ProjectSetting, ProjectRole

def project_list(list_type, user_id):
    if list_type != None:
        if list_type == 'AVAILABLE':
            queryset = Projects.objects.prefetch_related("member_set")\
                .filter(~Q(member__user_id=user_id) | Q(member__user_id=user_id, member__status = "REQUESTED"), status="ANNOTATION").distinct().order_by("member__status")
        elif list_type == 'ALL':
            queryset = Projects.objects.all().order_by("-id")
        else:
            queryset = Projects.objects.prefetch_related("member_set")\
                .filter(member__user_id = user_id, member__status = list_type).order_by("-id")
    else:
        queryset = Projects.objects.all().order_by("-id")

    return queryset

def project_detail_admin_check(project_id):
    queue_validator = QueueMember.objects.filter(project_id=project_id, status="VALIDATION")
    if queue_validator.count():
        return True
    else:
        return False

def project_detail_labeler_check(project_id, member):
    queue = QueueMember.objects.filter(project_id=project_id, member=member, status="ANNOTATION")
    queue_rejected = QueueMember.objects.filter(project_id=project_id, member=member, status="REJECTED")
    queue_label_id = None
    label_available = False
    num_queue_rejected = 0
    if queue.count():
        queue_label_id = queue[0].id
        label_available = True
    else:
        list_work_current = WorkItem.objects.filter(
            memberworkitem__member_id=member.id,
            project_id=project_id,
            memberworkitem__role="LABELER"
        ).values_list("row_id")
        db_workitem = WorkItem.objects.filter(
            ~Q(row_id__in=list_work_current),
            project_id=project_id,
            status="ANNOTATION"
        )
        if db_workitem.count():
            label_available = True

    if queue_rejected.count():
        num_queue_rejected = queue_rejected.count()
        label_available = True
    
    return queue_label_id, label_available, num_queue_rejected

def project_detail_reviewer_check(project_id, member, queue_size):
    queue = QueueMember.objects.filter(project_id=project_id, member=member, status="REVIEWING")
    queue_review_id = None
    review_available = False
    if queue.count(): 
        queue_review_id = queue.last().id
        review_available = True
    else:
        list_row = MemberWorkItem.objects.filter(member=member,role__in=["LABELER","REVIEWER"]).values_list('workitem__id')
        list_review_current = WorkItem.objects.filter(
            ~Q(id__in=list_row),
            memberworkitem__role="REVIEWER",
            memberworkitem__status="PENDING",
            project_id=project_id
        ).distinct()
        print("test", list_review_current.count())
        if list_review_current.count(): 
            if list_review_current.count() < queue_size:
                db_workitem = WorkItem.objects.filter(
                    ~Q(memberworkitem__member_id=member.id),
                    project_id=project_id,
                    status__in = ["ANNOTATION", "PENDING"]
                )
                if not db_workitem.count():
                    review_available = True
            else:
                review_available = True
    
    return queue_review_id, review_available

def project_finish(project_id):
    editor = Editor.objects.filter(project_id=project_id)
    project_settings = ProjectSetting.objects.filter(project_id=project_id)
    error = []
    if not editor.count():
        error.append('Editor not create')
    if not project_settings.count():
        error.append('Project not setting')

    if error != []:
        return error
    else:
        try:
            datasets = Dataset.objects.filter(projects=project_id)
            list_row = []
            for dataset in datasets:
                images = Image.objects.filter(dataset_id=dataset.id)
                for image in images:
                    list_row.append(image.id)
            overlap_percent = project_settings.last().overlap_percent
            overlap_time = project_settings.last().overlap_time
            gen_workitem = Generate(list_row, overlap_percent, overlap_time)
            list_origin, list_overlap = gen_workitem.gen_workitem()
            for row_origin in list_origin:
                WorkItem.objects.create(row_id=row_origin, project_id=project_id, type='ORIGINAL')
            for row_overlap in list_overlap:
                WorkItem.objects.create(row_id=row_overlap, project_id=project_id, type='OVERLAP')
        except Exception as Err:
            print("ERROR",Err)
            error.append("Can't create workitem in project, please try again")
    
    return error

def review_objects(workitems, labels):
    objects = []
    for label in labels:
        num_labeleditems = LabeledItem.objects.filter(workitem__in=workitems,label=label).count()
        objects.append(
                {'object': label.code, 
                'count': num_labeleditems, 
                'tool_type': label.tool.type, 
                'accuracy':0}
            )
        actilogs = ActivityLog.objects.filter(label=label)
        total_acc = 0
        len_label = 0
        for logger in actilogs:
            acc = logger.value.get("accuracy")
            if acc != None:
                total_acc += acc
                len_label += 1
        objects[-1]['accuracy'] = round(total_acc/len_label,2) if len_label != 0 else 0
    return objects

def project_overview(project_id, member_id):
    workitems = WorkItem.objects.prefetch_related('memberworkitem_set').filter(project_id=project_id)
    labels = Label.objects.select_related('tool__editor','tool').filter(tool__editor__project_id=project_id)
    if not member_id:
        members = Member.objects.filter(project_id=project_id)
        avg_accuracy = MemberWorkItem.objects.filter(
            ~Q(accuracy=0),
            workitem__in=workitems,
            role="LABELER"
        ).aggregate(Avg('accuracy'))['accuracy__avg']
        objects = review_objects(workitems, labels)
        db_log = ActivityLog.objects.filter(object="WORK_ITEM", action="SUBMIT", workitem__in=workitems)
        total_time = 0
        for logger in db_log:
            working_time = logger.value.get("working_time")
            if logger.value.get("working_time") != None:
                total_time += working_time
        review = {
            "workitem_unassigned" : workitems.filter(status="ANNOTATION").count(),
            "workitem_assigned" : workitems.filter(status__in=["REVIEWING", "PENDING"]).count(),
            "workitem_validating": workitems.filter(status="VALIDATION").count(),
            "workitem_completed": workitems.filter(status="COMPLETED").count(),
            "workitem_rejected": workitems.filter(status="REJECTED").count(),
            "workitem_reviewing": workitems.filter(status="REVIEWING").count(),
            "workitem_annotating": workitems.filter(status="PENDING").count(),
            "workitem_skipped": workitems.filter(status="SKIPPED").count(),
            "total_rejected": members.aggregate(Sum('total_rejected'))['total_rejected__sum'],
            "workitem_original": workitems.filter(type="ORIGINAL").count(),
            "workitem_overlap": workitems.filter(type="OVERLAP").count(),
            "workitem_review": workitems.filter(memberworkitem__role="REVIEWER").distinct().count(),
            "workitem_non_review": workitems.filter(~Q(memberworkitem__role="REVIEWER")).count(),
            "avg_accuracy": round(avg_accuracy,2) if avg_accuracy != None else 0,
            "total_like": WorkItemVote.objects.filter(member__in=members, score = 1).count(),
            "total_dislike": WorkItemVote.objects.filter(member__in=members, score = -1).count(),
            "workitem_working_time": total_time,
            "objects": objects,
            }
    else:
        workitem_validation = workitems.filter(
            memberworkitem__member_id=member_id,
            memberworkitem__status="SUBMITED", 
            memberworkitem__role="LABELER"
        )
        objects = review_objects(workitem_validation, labels)

        review = {
            "workitem_validation": workitem_validation.count(),
            "workitem_skip": workitems.filter(memberworkitem__member_id=member_id, memberworkitem__status="SKIPPED", memberworkitem__role="LABELER").count(),
            "workitem_remaining": workitems.filter(memberworkitem__member_id=member_id, memberworkitem__status="PENDING", memberworkitem__role="LABELER").count(),
            "workitem_completed": workitems.filter(memberworkitem__member_id=member_id, status="COMPLETED", memberworkitem__role="LABELER").count(),
            "workitem_rejected": workitems.filter(memberworkitem__member_id=member_id, status="REJECTED", memberworkitem__role="LABELER").count(),
            "total_rejected": Member.objects.get(id=member_id).total_rejected,
            "objects": objects,
        }
    return review

