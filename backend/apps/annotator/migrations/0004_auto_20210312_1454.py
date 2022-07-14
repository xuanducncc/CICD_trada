# Generated by Django 3.1.6 on 2021-03-12 07:54

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('editor', '0003_auto_20210308_1606'),
        ('annotator', '0003_auto_20210308_1606'),
    ]

    operations = [
        migrations.RenameField(
            model_name='labeleditem',
            old_name='classCode',
            new_name='labelCode',
        ),
        migrations.RenameField(
            model_name='labeleditem',
            old_name='className',
            new_name='labelName',
        ),
        migrations.RenameField(
            model_name='labeleditem',
            old_name='classValue',
            new_name='labelValue',
        ),
        migrations.RemoveField(
            model_name='labeleditem',
            name='classId',
        ),
        migrations.AddField(
            model_name='labeleditem',
            name='label',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='editor.label'),
        ),
        migrations.AddField(
            model_name='labeleditem',
            name='tool',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='editor.tool'),
        ),
    ]
