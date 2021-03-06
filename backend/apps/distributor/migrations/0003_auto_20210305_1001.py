# Generated by Django 3.1.6 on 2021-03-05 03:01

import backend.apps.cms.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('uploader', '0001_initial'),
        ('cms', '0003_auto_20210305_1001'),
        ('distributor', '0002_workitem_project'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='workitem',
            name='member',
        ),
        migrations.AlterField(
            model_name='workitem',
            name='row',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='uploader.image'),
        ),
        migrations.AlterField(
            model_name='workitem',
            name='status',
            field=models.CharField(choices=[('pending', 'PENDING'), ('annotation', 'ANNOTATION'), ('validation', 'VALIDATION'), ('completed', 'COMPLETED'), ('skiped', 'SKIPED'), ('rejected', 'REJECTED'), ('active', 'ACTIVE'), ('inactive', 'INACTIVE'), ('invited', 'INVITED'), ('requested', 'REQUESTED'), ('joined', 'JOINED')], default=backend.apps.cms.models.StatusChoice['ANNOTATION'], max_length=64),
        ),
        migrations.AlterField(
            model_name='workitem',
            name='type',
            field=models.CharField(choices=[('original', 'ORIGINAL'), ('overlap', 'OVERLAP'), ('skipped', 'SKIPPED')], max_length=64),
        ),
        migrations.CreateModel(
            name='MemberWorkItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('pending', 'PENDING'), ('annotation', 'ANNOTATION'), ('validation', 'VALIDATION'), ('completed', 'COMPLETED'), ('skiped', 'SKIPED'), ('rejected', 'REJECTED'), ('active', 'ACTIVE'), ('inactive', 'INACTIVE'), ('invited', 'INVITED'), ('requested', 'REQUESTED'), ('joined', 'JOINED')], default=backend.apps.cms.models.StatusChoice['ANNOTATION'], max_length=64)),
                ('role', models.CharField(choices=[('reviewer', 'REVIEWER'), ('labeler', 'LABELER'), ('admin', 'ADMIN')], default=backend.apps.cms.models.RoleChoice['LABELER'], max_length=64)),
                ('member', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='cms.member')),
                ('workitem', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='distributor.workitem')),
            ],
        ),
        migrations.AddField(
            model_name='workitem',
            name='member',
            field=models.ManyToManyField(through='distributor.MemberWorkItem', to='cms.Member'),
        ),
    ]
