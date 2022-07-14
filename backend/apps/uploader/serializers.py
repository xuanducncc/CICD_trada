from django.db.models.fields import IntegerField
from rest_framework import serializers
from rest_framework.fields import ImageField, ListField
from .models import Image

class ImageSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    dataset_id = serializers.IntegerField(required=True)
    image = serializers.ImageField(required=True)

    class Meta:
        model = Image
        fields = ('id', 'dataset_id', 'image')

class ImageWorkItemSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    image = serializers.ImageField()
    dataset_id = serializers.IntegerField()
    class Meta:
        models = Image
        fields = ('id', 'image', 'dataset_id')
        ordering = ['-id']