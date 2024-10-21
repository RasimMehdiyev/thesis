# Generated by Django 5.1 on 2024-10-20 13:24

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0017_remove_response_person'),
    ]

    operations = [
        migrations.CreateModel(
            name='QuestionnaireSections',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=45)),
                ('description', models.TextField(blank=True, null=True)),
                ('questionnaire', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dashboard.questionnaire')),
            ],
        ),
    ]
