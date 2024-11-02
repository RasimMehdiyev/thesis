# Generated by Django 5.1 on 2024-10-24 14:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0023_person_education_level'),
    ]

    operations = [
        migrations.AlterField(
            model_name='person',
            name='education_level',
            field=models.CharField(blank=True, choices=[('ISCED 1/2', '1'), ('ISCED 3/4', '2'), ('ISCED 5/6', '3')], max_length=10, null=True),
        ),
    ]