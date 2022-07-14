from backend.apps.distributor.models import WorkItem
from distributor.distributor import Generate
from backend.apps.uploader.models import Image
from backend.apps.cms.models import Dataset, ProjectSetting, Projects

def attach_dataset(validated_data):
    project_id = validated_data.get("project_id")
    dataset_id = validated_data.get("dataset_id")
    project = Projects.objects.get(id=project_id)
    dataset = Dataset.objects.get(id=dataset_id)
    if project.status == "ANNOTATION":
        project_setting = ProjectSetting.objects.get(project_id=project_id)
        overlap_percent = project_setting.overlap_percent
        overlap_time = project_setting.overlap_time
        db_images = Image.objects.filter(dataset_id=dataset_id)
        list_row = []
        for image in db_images:
            list_row.append(image.id)
        gen_workitem = Generate(list_row, overlap_percent, overlap_time)
        list_row_origin, list_row_overlap = gen_workitem.gen_workitem()
        for row_origin in list_row_origin:
            WorkItem.objects.create(row_id=row_origin, project_id=project_id, type='ORIGINAL')
        for row_overlap in list_row_overlap:
            WorkItem.objects.create(row_id=row_overlap, project_id=project_id, type='OVERLAP')
        dataset.projects.add(project)
    else:
        return None
    return True

