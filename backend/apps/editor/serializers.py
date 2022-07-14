from django import db
from django.db import models
from django.db.models import fields, query
from django.http import request
from rest_framework import serializers
from .models import *

class LabelSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(required=True)
    color = serializers.CharField(allow_blank=True)
    code = serializers.CharField(allow_blank=True)
    class Meta:
        models = Label
        fields = ('id', 'name' , 'color', 'code')

class ControlSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(required=True)
    type = serializers.ChoiceField(choices=TypeControlTool.choices())
    require = serializers.BooleanField(default=False)
    class Meta:
        models = Control
        fields = ('id', 'name', 'type', 'require')

class ToolSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    editor_id = serializers.IntegerField(required=True)
    name = serializers.CharField()
    description = serializers.CharField(allow_blank=True)
    type = serializers.ChoiceField(choices=TypeToolChoice.choices(), default=TypeToolChoice.CLASSIFICATION)
    labels = LabelSerializer(many=True, source='label_set', partial=True)
    controls = ControlSerializer(many=True, source='control_set', partial=True)
    class Meta:
        models = Tool
        fields = ('id', 'editor_id', 'type', 'label','control','name', 'description')
        ordering = ['-id']

    def create(self, validated_data):
        data_label = validated_data.pop('label_set')
        data_control = validated_data.pop('control_set')
        db_tool = Tool.objects.create(**validated_data)
        for label in data_label:
            db_label = Label.objects.create(tool=db_tool, **label)
            db_label.save()
        for control in data_control:
            db_control = Control.objects.create(tool=db_tool, **control)
            db_control.save()
        db_tool.save()
        return db_tool  

class EditToolSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    type = serializers.ChoiceField(choices=TypeToolChoice.choices(), default=TypeToolChoice.CLASSIFICATION)
    labels = LabelSerializer(many=True, source='label_set', partial=True)
    controls = ControlSerializer(many=True, source='control_set', partial=True)
    name = serializers.CharField()
    description = serializers.CharField(allow_blank=True)
    class Meta:
        models = Tool
        fields = ('id', 'editor_id', 'type', 'label','control','name','description')

class EditorSerializer(serializers.Serializer):
    project_id = serializers.IntegerField(required=True)
    type = serializers.ChoiceField(choices=TypeEditorChoice.choices(), default=TypeEditorChoice.IMAGE)
    tools = EditToolSerializer(many=True, source = "tool_set", partial=True)
    class Meta:
        models = Editor
        fields = ('id', 'project_id', 'type', 'tools')
        ordering = ['-id']

    def create(self, validated_data):
        Editor.objects.filter(project_id=validated_data.get('project_id')).delete()
        tools = validated_data.pop('tool_set')
        db_editor = Editor.objects.create(**validated_data)
        for tool in tools:
            data_label = tool.pop('label_set')
            data_control = tool.pop('control_set')
            db_tool = Tool.objects.create(editor=db_editor, type=tool.get('type'),name=tool.get('name'),description=tool.get('description'))
            for label in data_label:
                db_label = Label.objects.create(tool=db_tool, **label)
                db_label.save()
            for control in data_control:
                db_control = Control.objects.create(tool=db_tool, **control)
                db_control.save()
        db_editor.save()
        return db_editor

class IntructionSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    project_id = serializers.IntegerField(required=True)
    title = serializers.CharField(required=False)
    attachment = serializers.FileField(required=True, read_only=False)
    class Meta:
        models = Instruction
        fields = ('id', 'project_id', 'title', 'attachment')
        ordering =['-id']

    def create(self, validated_data):
        # Instruction.objects.get_or_create(editor_id=validated_data.get("editor_id")).delete()
        instruction = Instruction.objects.filter(project_id=validated_data.get("project_id"))
        if instruction.count() > 0:
            instruction.delete()
        db_instruction = Instruction.objects.create(**validated_data)
        
        return db_instruction
