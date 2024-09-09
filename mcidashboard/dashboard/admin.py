from django.contrib import admin
from .models import *
# Register your models here.

class PatientAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'age', 'birth_date', 'education', 'MMSE', 'MoCA', 'has_depression', 'has_anxiety')
    list_filter = ('has_depression', 'has_anxiety')
    search_fields = ('first_name', 'last_name', 'age', 'education')
    ordering = ['last_name']
admin.site.register(Patient)
