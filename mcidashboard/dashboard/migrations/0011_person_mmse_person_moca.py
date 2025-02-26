# Generated by Django 5.1 on 2024-09-29 14:15

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0010_alter_personbiomarkers_gameid'),
    ]

    operations = [
        migrations.AddField(
            model_name='person',
            name='MMSE',
            field=models.IntegerField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(30)]),
        ),
        migrations.AddField(
            model_name='person',
            name='MoCA',
            field=models.FloatField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(30)]),
        ),
    ]
