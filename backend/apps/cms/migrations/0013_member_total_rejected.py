# Generated by Django 3.1.6 on 2021-04-23 16:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cms', '0012_auto_20210423_1520'),
    ]

    operations = [
        migrations.AddField(
            model_name='member',
            name='total_rejected',
            field=models.IntegerField(default=0),
        ),
    ]
