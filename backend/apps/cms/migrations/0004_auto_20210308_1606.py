# Generated by Django 3.1.6 on 2021-03-08 09:06

import backend.apps.cms.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cms', '0003_auto_20210305_1001'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dataset',
            name='in_type',
            field=models.CharField(choices=[('SEGMENT', 'SEGMENT'), ('CLASSIFICATION', 'CLASSIFICATION'), ('AUDIO', 'AUDIO')], max_length=64),
        ),
        migrations.AlterField(
            model_name='dataset',
            name='status',
            field=models.CharField(choices=[('PENDING', 'PENDING'), ('ANNOTATION', 'ANNOTATION'), ('VALIDATION', 'VALIDATION'), ('COMPLETED', 'COMPLETED'), ('SKIPED', 'SKIPED'), ('REJECTED', 'REJECTED'), ('ACTIVE', 'ACTIVE'), ('INACTIVE', 'INACTIVE'), ('INVITED', 'INVITED'), ('REQUESTED', 'REQUESTED'), ('JOINED', 'JOINED')], default=backend.apps.cms.models.StatusChoice['ACTIVE'], max_length=64),
        ),
        migrations.AlterField(
            model_name='member',
            name='role',
            field=models.CharField(choices=[('REVIEWER', 'REVIEWER'), ('LABELER', 'LABELER'), ('ADMIN', 'ADMIN')], default=backend.apps.cms.models.RoleChoice['LABELER'], max_length=64),
        ),
        migrations.AlterField(
            model_name='member',
            name='status',
            field=models.CharField(choices=[('PENDING', 'PENDING'), ('ANNOTATION', 'ANNOTATION'), ('VALIDATION', 'VALIDATION'), ('COMPLETED', 'COMPLETED'), ('SKIPED', 'SKIPED'), ('REJECTED', 'REJECTED'), ('ACTIVE', 'ACTIVE'), ('INACTIVE', 'INACTIVE'), ('INVITED', 'INVITED'), ('REQUESTED', 'REQUESTED'), ('JOINED', 'JOINED')], max_length=64),
        ),
        migrations.AlterField(
            model_name='projects',
            name='status',
            field=models.CharField(choices=[('PENDING', 'PENDING'), ('ANNOTATION', 'ANNOTATION'), ('VALIDATION', 'VALIDATION'), ('COMPLETED', 'COMPLETED'), ('SKIPED', 'SKIPED'), ('REJECTED', 'REJECTED'), ('ACTIVE', 'ACTIVE'), ('INACTIVE', 'INACTIVE'), ('INVITED', 'INVITED'), ('REQUESTED', 'REQUESTED'), ('JOINED', 'JOINED')], default=backend.apps.cms.models.StatusChoice['PENDING'], max_length=64),
        ),
    ]
