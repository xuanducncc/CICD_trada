# Generated by Django 3.1.6 on 2021-03-02 10:54

import backend.apps.cms.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('cms', '0002_projectsetting'),
        ('uploader', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='WorkItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(choices=[('original', 'ORIGINAL'), ('overlap', 'OVERLAP')], max_length=64)),
                ('status', models.CharField(choices=[('annotation', 'ANNOTATION'), ('validation', 'VALIDATION'), ('completed', 'COMPLETED'), ('active', 'ACTIVE'), ('inactive', 'INACTIVE'), ('invited', 'INVITED'), ('requested', 'REQUESTED'), ('joined', 'JOINED')], default=backend.apps.cms.models.StatusChoice['ANNOTATION'], max_length=64)),
                ('member', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='+', to='cms.member')),
                ('row', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='+', to='uploader.image')),
            ],
        ),
    ]
