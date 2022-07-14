# Generated by Django 3.1.6 on 2021-03-12 07:54

import backend.apps.cms.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('cms', '0004_auto_20210308_1606'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dataset',
            name='status',
            field=models.CharField(choices=[('PENDING', 'PENDING'), ('ANNOTATION', 'ANNOTATION'), ('VALIDATION', 'VALIDATION'), ('COMPLETED', 'COMPLETED'), ('SKIPPED', 'SKIPPED'), ('SUBMITED', 'SUBMITED'), ('REJECTED', 'REJECTED'), ('ACTIVE', 'ACTIVE'), ('INACTIVE', 'INACTIVE'), ('INVITED', 'INVITED'), ('REQUESTED', 'REQUESTED'), ('JOINED', 'JOINED')], default=backend.apps.cms.models.StatusChoice['ACTIVE'], max_length=64),
        ),
        migrations.AlterField(
            model_name='member',
            name='project',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='cms.projects'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='member',
            name='status',
            field=models.CharField(choices=[('PENDING', 'PENDING'), ('ANNOTATION', 'ANNOTATION'), ('VALIDATION', 'VALIDATION'), ('COMPLETED', 'COMPLETED'), ('SKIPPED', 'SKIPPED'), ('SUBMITED', 'SUBMITED'), ('REJECTED', 'REJECTED'), ('ACTIVE', 'ACTIVE'), ('INACTIVE', 'INACTIVE'), ('INVITED', 'INVITED'), ('REQUESTED', 'REQUESTED'), ('JOINED', 'JOINED')], max_length=64),
        ),
        migrations.AlterField(
            model_name='projects',
            name='status',
            field=models.CharField(choices=[('PENDING', 'PENDING'), ('ANNOTATION', 'ANNOTATION'), ('VALIDATION', 'VALIDATION'), ('COMPLETED', 'COMPLETED'), ('SKIPPED', 'SKIPPED'), ('SUBMITED', 'SUBMITED'), ('REJECTED', 'REJECTED'), ('ACTIVE', 'ACTIVE'), ('INACTIVE', 'INACTIVE'), ('INVITED', 'INVITED'), ('REQUESTED', 'REQUESTED'), ('JOINED', 'JOINED')], default=backend.apps.cms.models.StatusChoice['PENDING'], max_length=64),
        ),
    ]
