# Generated by Django 3.1.6 on 2021-04-06 14:36

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('cms', '0008_auto_20210319_1507'),
        ('distributor', '0007_auto_20210318_1717'),
    ]

    operations = [
        migrations.CreateModel(
            name='QueueMember',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_created', models.DateTimeField(auto_created=True, auto_now_add=True)),
                ('accuracy', models.FloatField(default=0.0, validators=[django.core.validators.MaxValueValidator(100), django.core.validators.MinValueValidator(0)])),
                ('date_validated', models.DateTimeField(blank=True, null=True)),
                ('submited_item', models.IntegerField(default=0)),
                ('skipped_item', models.IntegerField(default=0)),
                ('completed_item', models.IntegerField(default=0)),
                ('size_item', models.IntegerField(default=0)),
                ('status', models.CharField(blank=True, choices=[('PENDING', 'PENDING'), ('ANNOTATION', 'ANNOTATION'), ('VALIDATION', 'VALIDATION'), ('COMPLETED', 'COMPLETED'), ('SKIPPED', 'SKIPPED'), ('SUBMITED', 'SUBMITED'), ('REJECTED', 'REJECTED'), ('ACTIVE', 'ACTIVE'), ('INACTIVE', 'INACTIVE'), ('INVITED', 'INVITED'), ('REQUESTED', 'REQUESTED'), ('JOINED', 'JOINED')], max_length=64, null=True)),
                ('member', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='cms.member')),
            ],
        ),
        migrations.AddField(
            model_name='memberworkitem',
            name='queue',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='distributor.queuemember'),
        ),
    ]
