# Generated by Django 5.1 on 2024-09-30 19:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0012_person_full_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='biomarker',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
    ]
