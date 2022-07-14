from rest_framework import serializers, status
from rest_framework.response import Response

from .models import User


class UserSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    first_name = serializers.CharField(read_only=True)
    last_name = serializers.CharField(read_only=True)
    email = serializers.EmailField(required=True)
    username = serializers.CharField()
    password = serializers.CharField(min_length=8, write_only=True)
    is_staff = serializers.BooleanField(read_only=True)
    is_active = serializers.BooleanField(read_only=True)
    date_joined = serializers.DateTimeField(read_only=True)
    is_superuser = serializers.BooleanField(read_only=True)
    credit_score = serializers.FloatField(read_only=True)
    
    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'id', 'first_name', 
                'last_name', 'is_staff', 'is_active', 'date_joined', 'is_superuser', 'credit_score')

        extra_kwargs = {'password': {'write_only': True}}

    # def create(self, validated_data):
    #     password = validated_data.pop('password', None)
    #     email = validated_data.get('email')
    #     username = validated_data.get('username')
    #     print(email, username)
    #     _name = User.objects.filter(username=username)
    #     if _name.count() > 0:
    #         return Response({"error":{"message":"Username is exist"}}, status=status.HTTP_409_CONFLICT)
    #     _email = User.objects.filter(email=email)
    #     if _email.count() > 0:
    #         return Response({"error":{"message":"Email is exist"}})
    #     instance = User.objects.create(**validated_data)
    #     if password is not None:
    #         instance.set_password(password)
    #     instance.save()
