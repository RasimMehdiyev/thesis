# Generated by Django 5.1 on 2024-09-21 14:31

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0004_biomarkertype_biomarker'),
    ]

    operations = [
        migrations.CreateModel(
            name='BiomarkerStats',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('avgMCI', models.FloatField()),
                ('sdMCI', models.FloatField()),
                ('avgHealthy', models.FloatField()),
                ('sdHealthy', models.FloatField()),
                ('biomarkerID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dashboard.biomarker')),
            ],
        ),
    ]
