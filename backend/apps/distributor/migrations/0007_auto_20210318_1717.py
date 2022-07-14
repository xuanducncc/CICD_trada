# Generated by Django 3.1.6 on 2021-03-18 10:17

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('distributor', '0006_memberworkitem_accuracy'),
    ]

    operations = [
        migrations.AlterField(
            model_name='memberworkitem',
            name='accuracy',
            field=models.FloatField(default=0.0, validators=[django.core.validators.MaxValueValidator(100), django.core.validators.MinValueValidator(0)]),
        ),
    ]
