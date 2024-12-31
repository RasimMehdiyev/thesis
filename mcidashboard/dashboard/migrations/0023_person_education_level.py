# Generated by Django 5.1 on 2024-10-24 13:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0022_question_charlimit_question_nospecialchars'),
    ]

    operations = [
        migrations.AddField(
            model_name='person',
            name='education_level',
            field=models.CharField(blank=True, choices=[('1', 'ISCED 1/2'), ('2', 'ISCED 3/4'), ('3', 'ISCED 5/6')], max_length=1, null=True),
        ),
    ]
