from rest_framework import serializers
from .models import Element

class ElementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Element
        fields = ['id', 'element_type', 'ip_address', 'name', 'device_type']