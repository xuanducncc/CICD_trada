from django.db import models
from django.conf import settings
from backend.apps.cms.models import Dataset, Member, StatusChoice

class Image(models.Model):
    class Meta:
        verbose_name = 'ImageUploader'
        verbose_name_plural = 'ImageUploader'

    dataset = models.ForeignKey(
        Dataset,
        on_delete=models.CASCADE,
    )
    image = models.ImageField(upload_to='images', max_length=2048)
