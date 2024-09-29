# Generated by Django 5.1 on 2024-09-25 19:12

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0008_person_patient_code'),
    ]

    operations = [
        migrations.CreateModel(
            name='PersonBiomarkers',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('value', models.FloatField()),
                ('biomarkerID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dashboard.biomarker')),
                ('gameID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dashboard.game')),
                ('personID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dashboard.person')),
            ],
        ),
    ]