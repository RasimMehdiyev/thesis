# Generated by Django 5.1 on 2024-10-17 12:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0015_remove_answer_questionnaire_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='questionnaire',
            name='prolific_id',
        ),
        migrations.AddField(
            model_name='response',
            name='prolific_id',
            field=models.CharField(blank=True, max_length=45, null=True),
        ),
    ]
