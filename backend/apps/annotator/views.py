from concurrent.futures import thread
from django.db.models import Avg
from backend.apps.validator.models import WorkItemVote
from django.core.checks.messages import Error
from numpy import average, datetime64
from datetime import datetime,timezone
import numpy as np
from backend.apps.uploader.models import Image
from backend.apps.logger.models import *
from backend.apps.distributor.models import *
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
from validator.accuracy.verify_classification import Accuracy_classification as acc_classes
from validator.accuracy.verify_box import bbox_to_polygon, Accuracy_polygon
from bbox_utils import BoundingBox
import sys
import asyncio
import json
import threading
class LabeledItemCreate(CreateAPIView):
    """Create a LabeledItem"""
    serializer_class = LabeledItemSerializer

create_labeleditem = LabeledItemCreate.as_view()

class WorkItemLabeledCreate(GenericAPIView):
    serializer_class = LabeledItemSerializer
    def post(self, request, pk):
        data = ast.literal_eval(request.body.decode("UTF-8"))
        for labeled in data:
            labeled['workitem_id'] = pk
            LabeledItem.objects.create(**labeled)

        return Response(data,status=status.HTTP_200_OK)

class WorkItemLabeledUpdate(GenericAPIView):
    serializer_class = LabeledItemSerializer
    queryset = LabeledItem.objects.all()
    def post(self, request, pk):
        LabeledItem.objects.filter(workitem_id = pk).delete()
        labeledItems = ast.literal_eval(request.body.decode("UTF-8"))
        for labeledItem in labeledItems:
            labeledItem['workitem_id'] = pk
            LabeledItem.objects.create(**labeledItem)
        db_workitem = WorkItem.objects.get(id = pk)
        db_workitem.status = 'VALIDATION'
        return Response(labeledItems,status=status.HTTP_200_OK)


create_workitemLabeled = WorkItemLabeledCreate.as_view()
update_workitemLabeled = WorkItemLabeledUpdate.as_view()

class calculate_workitem():
    def __init__(self, tooltype, workitem, labeleditem, logger):
        self.tooltype = tooltype
        self.labeleditem = labeleditem
        self.current_mbworkitem = workitem.memberworkitem_set.get(role="LABELER", status__in=["SUBMITED", "SKIPPED"])
        self.current_member = self.current_mbworkitem.member
        project_id = workitem.project_id
        row_id = workitem.row_id

        related_workitem = WorkItem.objects.filter(
                    ~Q(member=self.current_member),
                    project_id=project_id,
                    row_id = row_id
        )
        self.related_mbworkitems = MemberWorkItem.objects.filter(
                    ~Q(member=self.current_member),
                    workitem__project_id = project_id,
                    workitem__row_id = row_id,
                    role = "LABELER",
                    status__in = ["SUBMITED","SKIPPED"]
        )
        print(self.related_mbworkitems)
        if related_workitem.count() == 0:
            logger.value["is_related"] = False
            logger.save()

    def classification(self):
        labeleditems = [[self.labeleditem, self.current_mbworkitem]]
        for rlt_mbwi in self.related_mbworkitems:
            labeled = LabeledItem.objects.filter(
                    toolType=self.tooltype,
                    workitem= rlt_mbwi.workitem,
                    tool_id=self.labeleditem.tool.id
                )

            if labeled.count() != 0:
                labeleditems.append([labeled.last(), rlt_mbwi])
            else:
                labeled = labeleditem_value(labelCode=None, toolType=self.tooltype)
                labeleditems.append([labeled,rlt_mbwi])
        if len(labeleditems) > 1:
            calculate_classification = acc_classes(labeleditems)
            results = calculate_classification.verify_classes()
        else:
            results = {self.current_mbworkitem:{self.labeleditem : 0}}
        return results

    def detection(self):
        labeleditems = [[self.labeleditem, self.current_mbworkitem]]
        for rlt_mbwi in self.related_mbworkitems:
            labeled = LabeledItem.objects.filter(
                    toolType=self.tooltype,
                    workitem= rlt_mbwi.workitem,
                    label_id = self.labeleditem.label.id
                )
            if labeled.count() != 0:
                labeleditems.append([labeled.last(), rlt_mbwi])
            else:
                labeled = labeleditem_value(labelValue={}, controlType=self.tooltype)
                print(labeled)
                labeleditems.append([labeled, rlt_mbwi])
        if len(labeleditems) > 1:
            calculate_detection = Accuracy_polygon(labeleditems)
            results = calculate_detection.verify_polygons()
        else:
            results = {self.current_mbworkitem: {self.labeleditem: 0}}
        return results

class labeleditem_value():
    def __init__(self, tool=None, workitem_id=None, toolType=None, controlType=None, labelName=None, labelCode=None, label=None, labelValue=None, index=None):
        self.tool = tool
        self.workitem_id = workitem_id
        self.toolType = toolType
        self.controlType = controlType
        self.labelName = labelName
        self.labelCode = labelCode
        self.label = label
        self.labelValue = labelValue
        self.index = index
# def calcu_time_per(member):
#     db_log = ActivityLog.objects.filter(object="WORK_ITEM", action="SUBMIT", member_id=member.id)
#     total_time = 0
#     for logger in db_log:
#         working_time = logger.value.get("working_time")
#         if logger.value.get("working_time") != None:
#             total_time += working_time
#     db_labeleditem = LabeledItem.objects.filter(workitem__member = member)
#     member.time_per = round(total_time/db_labeleditem.count(),2) if db_labeleditem.count() else total_time
#     member.save()
# @async_to_sync
def save_log(member):
    label_count = LabeledItem.objects.filter(workitem__member=member, workitem__memberworkitem__status__in=["SUBMITED","PENDING"])
    skip_count = MemberWorkItem.objects.filter(member=member, status="SKIPPED", role="LABELER")
    submit_count = MemberWorkItem.objects.filter(member=member, status="SUBMITED", role="LABELER")
    log_query = ActivityLog.objects.filter(member=member, action__in=["SUBMIT","SKIP"], object="WORK_ITEM")  
    total_time = 0
    _label_count = label_count.count() if label_count.count() != 0 else 1
    for log in log_query:
        if log.value.get('working_time') != None:
            total_time += log.value.get('working_time')
    time_per_label = round(total_time/_label_count,2)
    member.label_count = label_count.count()
    member.submit_count = submit_count.count()
    member.skip_count = skip_count.count()
    member.total_time = total_time
    member.time_per = time_per_label
    member.save()
    return True

def cal_all(labeleditems, db_workitem, logg):
    results_accuracy = {}
    for labelitem in labeleditems:
        tooltype = labelitem.toolType
        workitem = db_workitem
        logger = logg
        cal_workitem = calculate_workitem(tooltype, workitem, labelitem, logger)
        if tooltype == "CLASSIFICATION":
            results_classification = cal_workitem.classification()
            for result in results_classification:
                if results_accuracy.get(result) == None:
                    results_accuracy.update(
                        {
                            result: results_classification[result]
                        }
                    )
                else:
                    results_accuracy[result].update(results_classification[result])
        elif tooltype == "DETECTION":
            results_detection = cal_workitem.detection()
            for result in results_detection:
                if results_accuracy.get(result) == None:
                    results_accuracy.update(
                        {
                            result: results_detection[result]
                        }
                    )
                else:
                    results_accuracy[result].update(results_detection[result])
    


class SubmitWorkItem(GenericAPIView):
    serializer_class = LabeledItemSerializer
    queryset = LabeledItem.objects.all()
    def post(self, request, pk):
        try:
            data = json.loads(request.body)
            user_id = request.user.id
            db_workitem = WorkItem.objects.get(id=pk)
            _member = Member.objects.get(user_id=user_id, project_id=db_workitem.project_id)
            db_mbworkitem = MemberWorkItem.objects.get(workitem_id=pk, status__in=['PENDING','SUBMITED','SKIPPED'], role='LABELER', member=_member)
            # if db_mbworkitem.status == "SKIPPED":
            #     return Response({"error":{"message": "The workitem was skipped"}}, status=status.HTTP_409_CONFLICT)
            db_mbworkitem.status = 'SUBMITED'
            db_mbworkitem.save()

            db_labeleditem = LabeledItem.objects.filter(workitem_id = pk)
            db_labeleditem.delete()
            _dbwi = MemberWorkItem.objects.filter(
                workitem_id = pk,
                role = "REVIEWER",
            )
            if _dbwi.count() == 0:
                db_workitem.status = 'VALIDATION'
            else:
                db_workitem.status = 'REVIEWING'
                for dbwi_review in _dbwi:
                    if dbwi_review.queue_id != None:
                        dbwi_review.status = "REVIEWING"
                        _queue = dbwi_review.queue
                        _queue.status = "REVIEWING"
                        dbwi_review.save()
                        _queue.save()
            db_workitem.save()

            member_id = db_mbworkitem.member_id
            project_id = db_workitem.project_id
            db_workitem_log = ActivityLog.objects.filter(object="WORK_ITEM", action="START", member_id=member_id,
                                                        project_id=project_id, workitem_id=pk).last()

            start_time = db_workitem_log.action_time
            stop_time = datetime.now()
            work_time = round((stop_time-start_time).total_seconds())
            average_time = work_time // len(data) if len(data) != 0 else 0
            logg, created = ActivityLog.objects.get_or_create(
                object='WORK_ITEM',
                action='SUBMIT',
                #value = {'working_time': work_time, 'dataset_name': db_workitem.row.dataset.name, 'accuracy': 0, 'is_related': True},
                member_id = member_id,
                project_id = project_id,
                user_id = user_id,
                workitem_id = pk
            )
            if created:
                logg.value = {'working_time': work_time, 'dataset_name': db_workitem.row.dataset.name, 'accuracy': 0, 'is_related': True}
                logg.save()
            tools = {}
            editor = Editor.objects.get(project_id=project_id)
            db_tools = editor.tool_set.all()
            for tool in db_tools:
                if tools.get(tool.type) == None:
                    tools.update({tool:{tool.control_set.get():list(tool.label_set.all()), "require": tool.control_set.get().require}})
                else:
                    tools[tool].update(
                        {
                            tool.control_set.get(): list(tool.label_set.all()),
                            "require": tool.control_set.get().require
                        }
                    )
            labeleditems = []
            for labeled in data:
                labeleditem = LabeledItem.objects.create(workitem_id=pk,**labeled)
                _tooltype = labeleditem.toolType
                _tool = labeleditem.tool
                if _tooltype == "CLASSIFICATION":
                    tools.pop(_tool)
                elif _tooltype == "DETECTION":
                    _control = Control.objects.get(type=labeleditem.controlType, tool=_tool)
                    _label = labeleditem.label
                    tools[_tool][_control].remove(_label)
                    if tools[_tool][_control] == []:
                        tools.pop(_tool)
                ActivityLog.objects.create(
                    object="LABELED_ITEM",
                    action="CREATED",
                    value = {'working_time': average_time},
                    member_id = member_id,
                    project_id = project_id,
                    user_id = user_id,
                    workitem_id = pk,
                    label_id = labeled.get('label_id'),
                    tool_id = labeled.get('tool_id'),
                    labeleditem_id = labeleditem.id,
                )
                labeleditems.append(labeleditem)
            for tooltype in tools:
                if tooltype.type == "CLASSIFICATION":
                    if tools[tooltype].get("require") == True:
                        raise Exception("require")
                    controlType = next(iter(tools[tooltype].items()))[0].name
                    labeleditem = labeleditem_value(
                        workitem_id = pk,
                        toolType = tooltype.type,
                        controlType = controlType,
                        labelName = None,
                        labelCode = None,
                        index = 0,
                        label = None,
                        tool = tooltype,
                        labelValue = ""
                    )
                elif tooltype.type == "DETECTION":
                    for _control in tools[tooltype]:
                        labels = tools[tooltype][_control]
                        for label in labels:
                            labeleditem = labeleditem_value(
                                workitem_id = pk,
                                toolType = tooltype.type,
                                controlType = _control.name,
                                labelName = label.name,
                                labelCode = label.code,
                                label = label,
                                labelValue = {},
                                index = 0,
                                tool = tooltype
                            )
                labeleditems.append(labeleditem)
            results_accuracy = {}
            for labelitem in labeleditems:
                tooltype = labelitem.toolType
                workitem = db_workitem
                logger = logg
                cal_workitem = calculate_workitem(tooltype, workitem, labelitem, logger)
                if tooltype == "CLASSIFICATION":
                    results_classification = cal_workitem.classification()
                    for result in results_classification:
                        if results_accuracy.get(result) == None:
                            results_accuracy.update(
                                {
                                    result: results_classification[result]
                                }
                            )
                        else:
                            results_accuracy[result].update(results_classification[result])
                elif tooltype == "DETECTION":
                    results_detection = cal_workitem.detection()
                    for result in results_detection:
                        if results_accuracy.get(result) == None:
                            results_accuracy.update(
                                {
                                    result: results_detection[result]
                                }
                            )
                        else:
                            results_accuracy[result].update(results_detection[result])
            for mbworkitem in results_accuracy:
                total_acc = 0
                for _labeleditem in results_accuracy[mbworkitem]:
                    if type(_labeleditem) == type(LabeledItem()):
                        actilog = ActivityLog.objects.get(object="LABELED_ITEM", member_id=mbworkitem.member.id, labeleditem_id = _labeleditem.id, action="CREATED")
                        actilog.value.update({"accuracy": results_accuracy[mbworkitem].get(_labeleditem)})
                        actilog.save()
                    total_acc += results_accuracy[mbworkitem].get(_labeleditem)
                accuracy_mbworkitem = total_acc/len(results_accuracy[mbworkitem])
                mbworkitem.accuracy = accuracy_mbworkitem
                mbworkitem.save()
                actilog_wk = ActivityLog.objects.filter(object="WORK_ITEM", member_id=mbworkitem.member.id, action="SUBMIT", workitem_id = mbworkitem.workitem.id).last()
                if actilog_wk != None:
                    actilog_wk.value["accuracy"] = accuracy_mbworkitem
                    actilog_wk.save()
                member = mbworkitem.member
                mbwis = MemberWorkItem.objects.filter(member=member, status__in=["SUBMITED","SKIPPED"]).aggregate(Avg("accuracy"))
                member.accuracy = mbwis.get("accuracy__avg")
                member.save()
                queuembwi = QueueMember.objects.get(id = mbworkitem.queue_id)
                qmbwis = MemberWorkItem.objects.filter(~Q(accuracy=0), member=member, status="SUBMITED", queue_id=mbworkitem.queue_id).aggregate(Avg("accuracy")).get("accuracy__avg")
                queuembwi.accuracy = qmbwis if qmbwis != None else 0
                queuembwi.save()
            #calculator completed_rate:
            current_member = db_mbworkitem.member
            num_submit = MemberWorkItem.objects.filter(status="SUBMITED",member=current_member, role="LABELER")
            total_mbwi = MemberWorkItem.objects.filter(member=current_member, role="LABELER")
            current_member.completed_rate = round(num_submit.count()*100/total_mbwi.count(),2)
            current_member.benchmark_date = datetime.now()
            current_member.save()
            # save_log(current_member)
            thread = threading.Thread(target=save_log, args=(current_member,))
            thread.start()
            # calcu_time_per(current_member)
            db_queuewb = db_mbworkitem.queue
            db_queuewb.submited_item = MemberWorkItem.objects.filter(queue=db_queuewb.id, status__in=["SUBMITED"], member=current_member, role="LABELER").count()
            db_queuewb.skipped_item = MemberWorkItem.objects.filter(queue=db_queuewb.id, status__in=["SKIPPED"], member=current_member, role="LABELER").count()
            db_queuewb.save()
            #_mbworkitems = MemberWorkItem.objects.filter(queue_id=db_queuewb.id, status__in=["SUBMITED", "SKIPPED"])
            if db_labeleditem.count() == 0:
                memberworkitem_review = MemberWorkItem.objects.filter(workitem=db_workitem, role="REVIEWER")
                for mbwi_re in memberworkitem_review:
                    mbwi_re.status = "REVIEWED"
                    mbwi_re.save()
                db_workitem.status = 'VALIDATION'
                db_workitem.save()
            if db_queuewb.submited_item + db_queuewb.skipped_item == db_queuewb.size_item:
                _w = WorkItem.objects.filter(
                    memberworkitem__queue = db_queuewb,
                    memberworkitem__member = current_member,
                    memberworkitem__status = "SUBMITED"
                )
                _check_review = MemberWorkItem.objects.filter(workitem__in=_w, role="REVIEWER", status__in=["PENDING","REVIEWING"])
                if _check_review.count() != 0:
                    db_queuewb.status = "WAITING"
                else:
                    db_queuewb.status = "VALIDATION"
                db_queuewb.save()
                return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as Error:
            db_mbworkitem.status = 'PENDING'
            db_mbworkitem.save()
            db_workitem.status = 'PENDING'
            db_workitem.save()
            logg.delete()
            for label in labeleditems:
                label.delete()
            if str(Error) == "require":
                return Response({"error":{"message":str(tooltype.name)+" is required"}}, status=status.HTTP_409_CONFLICT)
            exc_type, exc_obj, exc_tb = sys.exc_info()
            fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
            print(exc_type, fname, exc_tb.tb_lineno)
            print("ERROR", Error)
            return Response({"error":{"message": "Can not submit multi boxes for workitem."}}, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_201_CREATED)

class SkipWorkItem(views.APIView):
    def post(self, request, pk):
        db_mbworkitem = MemberWorkItem.objects.get(workitem_id=pk, status__in=['PENDING', 'SUBMITED','SKIPPED'],role='LABELER')
        db_mbworkitem.status = 'SKIPPED'
        db_mbworkitem.save()
        user_id = request.user.id
        _db_workitem = WorkItem.objects.get(id = pk)
        _db_workitem.status = 'VALIDATION'
        _db_workitem.save()
        db_labeleditem = LabeledItem.objects.filter(workitem_id = pk)
        db_labeleditem.delete()
        member_id = db_mbworkitem.member_id
        project_id = _db_workitem.project_id
        current_member = db_mbworkitem.member
        db_workitem_log = ActivityLog.objects.filter(object="WORK_ITEM", action="START", member_id=member_id,
                                                user_id=user_id, project_id=project_id, workitem_id=pk).last()
        start_time = db_workitem_log.action_time
        stop_time = datetime.now()
        work_time = round((stop_time-start_time).total_seconds())

        logg = ActivityLog.objects.create(
            object='WORK_ITEM',
            action='SKIP',
            value = {'dataset_name': _db_workitem.row.dataset.name,'working_time': work_time},
            member_id = member_id,
            project_id = project_id,
            user_id = user_id,
            workitem_id = pk
        )
        tools = {}
        editor = Editor.objects.get(project_id=project_id)
        db_tools = editor.tool_set.all()
        for tool in db_tools:
            if tools.get(tool.type) == None:
                tools.update({tool:{tool.control_set.get():list(tool.label_set.all())}})
            else:
                tools[tool].update(
                    {
                        tool.control_set.get(): list(tool.label_set.all())
                    }
                )
        labeleditems = []
        for tooltype in tools:
            if tooltype.type == "CLASSIFICATION":
                controlType = next(iter(tools[tooltype].items()))[0].name
                labeleditem = labeleditem_value(
                    workitem_id = pk,
                    toolType = tooltype.type,
                    controlType = controlType,
                    labelName = None,
                    labelCode = None,
                    index = 0,
                    label = None,
                    tool = tooltype,
                    labelValue = ""
                )
            elif tooltype.type == "DETECTION":
                for _control in tools[tooltype]:
                    labels = tools[tooltype][_control]
                    for label in labels:
                        labeleditem = labeleditem_value(
                            workitem_id = pk,
                            toolType = tooltype.type,
                            controlType = _control.name,
                            labelName = label.name,
                            labelCode = label.code,
                            label = label,
                            labelValue = {},
                            index = 0,
                            tool = tooltype
                        )
            labeleditems.append(labeleditem)
        results_accuracy = {}
        for labelitem in labeleditems:
            tooltype = labelitem.toolType
            _workitem = WorkItem.objects.get(id = pk)

            logger = logg
            cal_workitem = calculate_workitem(tooltype, _workitem, labelitem, logger)
            if tooltype == "CLASSIFICATION":
                results_classification = cal_workitem.classification()
                for result in results_classification:
                    if results_accuracy.get(result) == None:
                        results_accuracy.update(
                            {
                                result: results_classification[result]
                            }
                        )
                    else:
                        results_accuracy[result].update(results_classification[result])
            elif tooltype == "DETECTION":
                results_detection = cal_workitem.detection()
                for result in results_detection:
                    if results_accuracy.get(result) == None:
                        results_accuracy.update(
                            {
                                result: results_detection[result]
                            }
                        )
                    else:
                        results_accuracy[result].update(results_detection[result])
        MemberWorkItem.objects.filter(workitem=_db_workitem, role="REVIEWER").delete()
        for mbworkitem in results_accuracy:
            total_acc = 0
            for _labeleditem in results_accuracy[mbworkitem]:
                if type(_labeleditem) == type(LabeledItem()):
                    actilog = ActivityLog.objects.get(object="LABELED_ITEM", member_id=mbworkitem.member.id, labeleditem_id = _labeleditem.id)
                    actilog.value.update({"accuracy": results_accuracy[mbworkitem].get(_labeleditem)})
                    actilog.save()
                total_acc += results_accuracy[mbworkitem].get(_labeleditem)
            accuracy_mbworkitem = total_acc/len(results_accuracy[mbworkitem])
            mbworkitem.accuracy = accuracy_mbworkitem
            mbworkitem.save()
            actilog_wk = ActivityLog.objects.filter(object="WORK_ITEM", member_id=mbworkitem.member.id, action__in=["SUBMIT","SKIP"], workitem_id = mbworkitem.workitem.id).last()
            if actilog_wk != None:
                actilog_wk.value["accuracy"] = accuracy_mbworkitem
                actilog_wk.save()
            member = mbworkitem.member
            mbwis = MemberWorkItem.objects.filter(member=member, status__in=["SUBMITED","SKIPPED"]).aggregate(Avg("accuracy"))
            member.accuracy = mbwis.get("accuracy__avg")
            member.save()
            queuembwi = QueueMember.objects.get(id = mbworkitem.queue_id)
            qmbwis = MemberWorkItem.objects.filter(~Q(accuracy=0), member=member, status__in=["SUBMITED","SKIPPED"], queue_id=mbworkitem.queue_id).aggregate(Avg("accuracy")).get("accuracy__avg")
            queuembwi.accuracy = qmbwis if qmbwis != None else 0
            queuembwi.save()

        num_submit = MemberWorkItem.objects.filter(status="SUBMITED",member=current_member, role="LABELER")
        total_mbwi = MemberWorkItem.objects.filter(member=current_member, role="LABELER")
        current_member.completed_rate = round(num_submit.count()*100/total_mbwi.count(),2)
        current_member.save()
        thread = threading.Thread(target=save_log, args=(current_member,))
        thread.start()
        # calcu_time_per(current_member)
        db_queuemember = db_mbworkitem.queue
        db_queuemember.skipped_item = MemberWorkItem.objects.filter(queue=db_queuemember.id, status="SKIPPED", member=current_member, role="LABELER").count()
        db_queuemember.submited_item = MemberWorkItem.objects.filter(queue=db_queuemember.id, status="SUBMITED", member=current_member, role="LABELER").count()
        db_queuemember.save()
        if db_queuemember.submited_item + db_queuemember.skipped_item == db_queuemember.size_item:
            _w = WorkItem.objects.filter(
                    memberworkitem__queue = db_queuemember,
                    memberworkitem__member = current_member,
                    memberworkitem__status = "SUBMITED"
                )
            _check_review = MemberWorkItem.objects.filter(workitem__in=_w, role="REVIEWER", status__in=["PENDING","REVIEWING"])
            if _check_review.count() != 0:
                db_queuemember.status = "WAITING"
            else:
                db_queuemember.status = "VALIDATION"
            db_queuemember.save()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        # serializer = WorkItemSerializer(workitem)

        return Response(status=status.HTTP_200_OK)

class WorkitemLabeledDetail(views.APIView):
    def get(self, request, pk):
        db_workitem = WorkItem.objects.get(id = pk)
        serializer = WorkItemLabeledSerializer(db_workitem)
        mbwi = MemberWorkItem.objects.filter(~Q(status = "SKIPPED"),workitem= pk, role="LABELER")
        results = serializer.data
        if mbwi.count() != 0:
            results.update({"accuracy": mbwi.last().accuracy})
        else:
            results.update({"accuracy": 0})
        return Response(results, status=status.HTTP_200_OK)


workitem_labeled_detail = WorkitemLabeledDetail.as_view()
skip_workitem = SkipWorkItem.as_view()
submit_workitem = SubmitWorkItem.as_view()
