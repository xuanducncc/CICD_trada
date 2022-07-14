from django.conf.urls import url
from django.urls import path
from .views import *

app_name = 'uploader'

urlpatterns = [
    path(
        'dataset/upload/',
        ImageView.as_view(),
        name='file-upload'
    ),
    path(
        'dataset/<int:pk>/images/',
        ImageList.as_view(),
        name='dataset-list-images'
    ),
    path('dataset/file/<int:pk>/', image_view, name='image-view'),
    path('dataset/<int:pk>/uploadzip/',upload_zip, name='upload-zip')
]