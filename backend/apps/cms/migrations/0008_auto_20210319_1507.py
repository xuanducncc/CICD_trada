# Generated by Django 3.1.6 on 2021-03-19 08:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cms', '0007_auto_20210318_1717'),
    ]

    operations = [
        migrations.AlterField(
            model_name='member',
            name='benchmark_date',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='member',
            name='join_date',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
