# Generated by Django 5.1 on 2024-09-25 19:40

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0009_personbiomarkers'),
    ]

    operations = [
        migrations.AlterField(
            model_name='personbiomarkers',
            name='gameID',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='dashboard.game'),
        ),
    ]