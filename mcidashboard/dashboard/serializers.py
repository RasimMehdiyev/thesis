from rest_framework import serializers
from .models import Patient

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ['first_name', 'last_name', 'age', 'birth_date', 'education', 'MMSE', 'MoCA', 'has_depression', 'has_anxiety']

