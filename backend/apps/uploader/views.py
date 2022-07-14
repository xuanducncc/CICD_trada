from backend.apps.cms.models import Dataset
from django.http import response
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView, ListAPIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from .serializers import ImageSerializer
from .models import Image
from django.conf import settings
import os
from django.http import HttpResponse, HttpResponseNotFound
import shutil
import zipfile
from django.core.files.storage import FileSystemStorage
import random
from rest_framework.pagination import PageNumberPagination
class ImageView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request):
        all_images = Image.objects.all()
        serializer = ImageSerializer(all_images, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        # converts querydict to original dict
        images = dict((request.data).lists())['image']
        dataset_id = request.data['dataset_id']
        flag = 1
        arr = []
        for img_name in images:
            modified_data = self.modify_input_for_multiple_files(img_name, dataset_id)
            image_serializer = ImageSerializer(data=modified_data)
            if image_serializer.is_valid():
                image_serializer.save()
                arr.append(image_serializer.data)
            else:
                flag = 0

        if flag == 1:
            db_images = Image.objects.filter(dataset_id=dataset_id)
            num_photo = db_images.count()
            db_dataset = Dataset.objects.get(id = dataset_id)
            db_dataset.num_photos = num_photo
            db_dataset.save()
            return Response(arr, status=status.HTTP_201_CREATED)
        else:
            return Response(arr, status=status.HTTP_400_BAD_REQUEST)

    def modify_input_for_multiple_files(self, image, dataset_id):
        dict = {}
        dict['dataset_id'] = int(dataset_id)
        dict['image'] = image
        return dict        

class ImageListPaginator(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 300

    def get_paginated_response(self, data):
        return Response(data
        , headers={
            "Pagination-Count": self.page.paginator.count,
            "Pagination-Page": self.page.number,
            "Pagination-Limit": self.page.paginator.num_pages
        })
class ImageList(ListAPIView):
    serializer_class = ImageSerializer
    pagination_class = ImageListPaginator
    def get_queryset(self):
        all_images = Image.objects.filter(dataset_id = self.kwargs["pk"])
        # serializer = ImageSerializer(all_images, many=True)
        return all_images

class ViewImage(APIView):
    def get(self, request, pk):
        db_image = Image.objects.get(id=pk)
        image = str(db_image.image)
        image_path = os.path.join(settings.MEDIA_ROOT,image)
        with open(image_path,'rb') as f:
            img = f.read()
        response = HttpResponse(img, content_type='image')
        response['Content-Disposition'] = 'attachment; filename="{}"'.format(image)
        return response
image_view = ViewImage.as_view()

class UploadZip(APIView):
    def post(self, request, pk):
        dataset_id = pk
        myfile = request.FILES['file']    
        fs = FileSystemStorage(location=settings.MEDIA_ROOT)
        filename = fs.save(myfile.name, myfile)
        path = os.path.join(settings.MEDIA_ROOT, filename)
        path_exp = os.path.join(settings.MEDIA_ROOT, "extractor")
        shutil.unpack_archive(path, path_exp)
        arr = []
        try:
            for root, dirs, files in os.walk(path_exp):
                for file_image in files:
                    path_image = os.path.join(root,file_image)
                    _image = os.path.join(settings.MEDIA_ROOT,"images", file_image)
                    if os.path.exists(_image):
                        name_split = file_image.split('.')
                        name_split[-2] = name_split[-2] + "_" + str(random.randrange(0,10000000))
                        file_image = '.'.join(map(str,name_split))
                    image = os.path.join(settings.MEDIA_ROOT,"images", file_image)
                    shutil.copy(path_image, image)
                    image_serializer = Image.objects.create(
                        dataset_id = int(dataset_id),
                        image = image,
                    )
                    arr.append(ImageSerializer(image_serializer).data)
        except:
            arr.append("Error file:" , file_image)
        db_images = Image.objects.filter(dataset_id=dataset_id)
        num_photo = db_images.count()
        db_dataset = Dataset.objects.get(id = dataset_id)
        db_dataset.num_photos = num_photo
        db_dataset.save()
        os.remove(path)
        shutil.rmtree(path_exp)
        return Response(arr,status=status.HTTP_201_CREATED)

upload_zip = UploadZip.as_view()