# Generated by Django 5.1 on 2024-10-22 10:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0019_remove_question_questionnaire_question_section'),
    ]

    operations = [
        migrations.AddField(
            model_name='questionnairesections',
            name='title_desc',
            field=models.CharField(blank=True, max_length=90, null=True),
        ),
    ]
