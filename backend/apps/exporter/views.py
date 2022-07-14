import shutil
from django.http import response
from django.http.response import HttpResponse
from rest_framework.generics import GenericAPIView
from django.urls.conf import path
import numpy as np
from datumaro.components.extractor import AnnotationType, DatasetItem, Bbox, LabelCategories, Annotation, Polygon
from datumaro.components.extractor import Label as LabelExport
from datumaro.components.dataset import Dataset as DataExport
import imageio
from backend.apps.editor.models import *
from backend.apps.annotator.models import *
from backend.apps.cms.serializers import  *
from rest_framework.response import Response
from rest_framework import status
from backend.settings.settings import *
from django.http import FileResponse
from zipfile import ZipFile
from datetime import datetime

class ProjectExport(GenericAPIView):
    serializer_class = ProjectSerializer
    queryset = Projects.objects.all()
    def post(self, request, pk):
        user_id = request.user.id
        project_id = pk
        db_label = Label.objects.filter(tool__editor__project=project_id)
        labels = list(label.name for label in db_label)
        i = 0
        dict_labels = {}
        for label in labels:
            dict_labels.update({label:i})
            i+=1
        db_labelitem = LabeledItem.objects.filter(workitem__project_id=project_id, workitem__status="COMPLETED")
        dataset = DataExport(categories={AnnotationType.label: LabelCategories.from_iterable(dict_labels)})
        images = []
        check_row = []
        check_wi = []
        annos = {}
        for labelitem in db_labelitem:
            row_id = labelitem.workitem.row.id
            workitem_id = labelitem.workitem_id
            if row_id not in check_row or workitem_id in check_wi:
                if annos.get(workitem_id) == None:
                    annos.update({workitem_id: [0,0,[]]})
                check_row.append(row_id)
                check_wi.append(workitem_id)
                image_path = str(labelitem.workitem.row.image)
                try:
                    label = labelitem.label.name
                except AttributeError:
                    pass
                path = os.path.join(MEDIA_ROOT,image_path)
                images.append(path)
                img = imageio.imread(path)
                annos[workitem_id][0] = image_path
                annos[workitem_id][1] = img 
                if labelitem.controlType == "BOUNDING_BOX":
                    label_value = labelitem.labelValue
                    x,y,w,h = label_value.get("x"), label_value.get("y"), label_value.get("width"), label_value.get("height")
                    annos[workitem_id][2].append(Bbox(x,y,w,h, label=dict_labels[label]))
                elif labelitem.toolType == "CLASSIFICATION":
                    annos[workitem_id][2].append(LabelExport(label=dict_labels[label]))
                elif labelitem.controlType == "POLYGON":
                    label_value = labelitem.labelValue
                    polygon = label_value.get("points")
                    annos[workitem_id][2].append(Polygon(polygon, label=dict_labels[label]))
        images = set(images)
        for annotation in annos:
            ids = annos[annotation][0]
            image = annos[annotation][1]
            annotations = annos[annotation][2]
            dataset.put(DatasetItem(id=ids, image=image, annotations=annotations))
        # for labelitem in db_labelitem:
        #     row_id = labelitem.workitem.row.id
        #     workitem_id = labelitem.workitem_id
        #     if row_id not in check_row or workitem_id in check_wi:
        #         image_path = str(labelitem.workitem.row.image)
        #         label = labelitem.label.name
        #         path = os.path.join(MEDIA_ROOT,image_path)
        #         images.append(path) 
        #         img = imageio.imread(path)
        #         if labelitem.controlType == "BOUNDING_BOX":
        #             label_value = labelitem.labelValue
        #             x,y,w,h = label_value.get("x"), label_value.get("y"), label_value.get("width"), label_value.get("height")
        #             dataset.put(DatasetItem(id = image_path, image=img, annotations=[Bbox(x,y,w,h, label=dict_labels[label])]))
        #         elif labelitem.toolType == "CLASSIFICATION":
        #             dataset.put(DatasetItem(id = image_path, image=img, annotations=[LabelExport(label=dict_labels[label])]))
        #         elif labelitem.controlType == "POLYGON":
        #             label_value = labelitem.labelValue
        #             polygon = label_value.get("points")
        #             dataset.put(DatasetItem(id = image_path, image=img, annotations=[Polygon(polygon, label=dict_labels[label])]))
        #         check_row.append(row_id)
        #         check_wi.append(workitem_id)
        if len(images) == 0:
            return Response({"Error":{"message": "No data"}})
        path_export = os.path.join(EXPORT_ROOT, 'project_{}_{}'.format(str(project_id),str(datetime.now())))
        dataset.export(path_export,'coco')
        file_image = os.path.join(path_export,'images/')
        for _img in images:
            path = os.path.join(MEDIA_ROOT,_img)
            shutil.copy(path, os.path.join(file_image))
        path_anno = ["annotations/instances_default.json", "annotations/labels_default.json"]
        for _path in path_anno:
            json_path = os.path.join(path_export,_path)
            if os.path.exists(json_path):
                json_path = os.path.join(path_export,_path)
                f = open(json_path,'rt')
                data = f.read()
                data = data.replace(".jpg\"","\"")
                f.close()
                f = open(json_path,'wt')
                f.write(data)
                f.close()
        zip_path = os.path.join(EXPORT_ROOT,'export_{}_{}'.format(str(project_id),str(datetime.now())))
        shutil.make_archive(zip_path, 'zip', path_export)
        zip_file = open(zip_path+'.zip','rb')
        response = FileResponse(zip_file, as_attachment=True)
        
        return response
        
export_project = ProjectExport.as_view()