from django.db import models

# Create your models here.
# patients model
class Patient(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    age = models.IntegerField( default=0)
    birth_date = models.DateField()
    education = models.CharField(max_length=100)
    # # Mini-Mental State Examination max scoer is 30
    MMSE = models.IntegerField(default=0)
    #  Montreal Cognitive Assessment max score is 30
    MoCA = models.IntegerField(default=0)
    has_depression = models.BooleanField(default=False)
    has_anxiety = models.BooleanField(default=False)

    def __str__(self):
        return self.first_name + ' ' + self.last_name
    
    