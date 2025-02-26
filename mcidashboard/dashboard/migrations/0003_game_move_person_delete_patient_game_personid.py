# Generated by Django 5.1 on 2024-09-21 09:38

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0002_patient_age'),
    ]

    operations = [
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('gametime', models.IntegerField(db_column='gameTime')),
                ('issolved', models.IntegerField(db_column='isSolved')),
                ('gameseed', models.IntegerField()),
                ('score', models.BigIntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Move',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('type', models.CharField(max_length=20)),
                ('timestamp', models.BigIntegerField(blank=True, null=True)),
                ('time', models.BigIntegerField()),
                ('accuracy', models.CharField(max_length=10)),
                ('originstack', models.CharField(db_column='originStack', max_length=10)),
                ('origincard', models.CharField(db_column='originCard', max_length=10)),
                ('destinationstack', models.CharField(db_column='destinationStack', max_length=10)),
                ('destinationcard', models.CharField(db_column='destinationCard', max_length=10)),
                ('numberofcardsmoved', models.IntegerField(db_column='numberOfCardsMoved')),
                ('score', models.IntegerField()),
                ('xcoordinate', models.FloatField(db_column='xCoordinate')),
                ('ycoordinate', models.FloatField(db_column='yCoordinate')),
                ('betaerror', models.IntegerField(db_column='betaError')),
                ('rankerror', models.IntegerField(db_column='rankError')),
                ('suiterror', models.IntegerField(db_column='suitError')),
                ('acebetaerror', models.IntegerField(db_column='aceBetaError')),
                ('kingbetaerror', models.IntegerField(db_column='kingBetaError')),
                ('noaceonsuiterror', models.IntegerField(db_column='noAceOnSuitError')),
                ('nokingonbuildstackerror', models.IntegerField(db_column='noKingOnBuildStackError')),
                ('gameID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dashboard.game')),
            ],
        ),
        migrations.CreateModel(
            name='Person',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('username', models.CharField(max_length=45)),
                ('password', models.CharField(max_length=45)),
                ('mci', models.IntegerField(db_column='MCI')),
                ('age', models.IntegerField()),
                ('gender', models.CharField(max_length=10)),
                ('playlevel', models.IntegerField(db_column='playLevel')),
                ('tabletlevel', models.IntegerField(db_column='tabletLevel')),
            ],
        ),
        migrations.DeleteModel(
            name='Patient',
        ),
        migrations.AddField(
            model_name='game',
            name='personID',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dashboard.person'),
        ),
    ]
