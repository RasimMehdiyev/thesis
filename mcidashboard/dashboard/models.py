from django.db import models

# Create your models here.
class Game(models.Model):
    id = models.BigAutoField(primary_key=True)
    personID = models.ForeignKey('Person', on_delete=models.CASCADE)  # Field name made lowercase.
    gametime = models.IntegerField(db_column='gameTime')  # Field name made lowercase.
    issolved = models.IntegerField(db_column='isSolved')  # Field name made lowercase.
    gameseed = models.IntegerField()
    score = models.BigIntegerField()
    timestamp = models.BigIntegerField(blank=True, null=True)

    def __str__(self):
        return str(self.id)



class Move(models.Model):
    id = models.BigAutoField(primary_key=True)
    gameID = models.ForeignKey(Game, on_delete=models.CASCADE)  # Field name made lowercase.
    type = models.CharField(max_length=20)
    timestamp = models.BigIntegerField(blank=True, null=True)
    time = models.BigIntegerField()
    accuracy = models.CharField(max_length=10)
    originstack = models.CharField(db_column='originStack', max_length=10)  # Field name made lowercase.
    origincard = models.CharField(db_column='originCard', max_length=10)  # Field name made lowercase.
    destinationstack = models.CharField(db_column='destinationStack', max_length=10)  # Field name made lowercase.
    destinationcard = models.CharField(db_column='destinationCard', max_length=10)  # Field name made lowercase.
    numberofcardsmoved = models.IntegerField(db_column='numberOfCardsMoved')  # Field name made lowercase.
    score = models.IntegerField()
    xcoordinate = models.FloatField(db_column='xCoordinate')  # Field name made lowercase.
    ycoordinate = models.FloatField(db_column='yCoordinate')  # Field name made lowercase.
    betaerror = models.IntegerField(db_column='betaError')  # Field name made lowercase.
    rankerror = models.IntegerField(db_column='rankError')  # Field name made lowercase.
    suiterror = models.IntegerField(db_column='suitError')  # Field name made lowercase.
    acebetaerror = models.IntegerField(db_column='aceBetaError')  # Field name made lowercase.
    kingbetaerror = models.IntegerField(db_column='kingBetaError')  # Field name made lowercase.
    noaceonsuiterror = models.IntegerField(db_column='noAceOnSuitError')  # Field name made lowercase.
    nokingonbuildstackerror = models.IntegerField(db_column='noKingOnBuildStackError')  # Field name made lowercase.

    def __str__(self):
        return "Game ID: " + str(self.gameID.id) + ' | Move type: ' + self.type


class Person(models.Model):
    id = models.BigAutoField(primary_key=True)
    username = models.CharField(max_length=45)
    password = models.CharField(max_length=45)
    mci = models.IntegerField(db_column='MCI')  # Field name made lowercase.
    age = models.IntegerField()
    gender = models.CharField(max_length=10)
    playlevel = models.IntegerField(db_column='playLevel')  # Field name made lowercase.
    tabletlevel = models.IntegerField(db_column='tabletLevel')  # Field name made lowercase.

    def __str__(self):
        return self.username

class BiomarkerType(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=45)
    description = models.CharField(max_length=45, blank=True, null=True)

    def __str__(self):
        return self.name

class Biomarker(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=45)
    type = models.ForeignKey(BiomarkerType, on_delete=models.CASCADE)
    unit = models.CharField(max_length=45, null=True, blank=True)
    def __str__(self):
        return self.name


class BiomarkerStats(models.Model):
    id = models.BigAutoField(primary_key=True)
    biomarkerID = models.ForeignKey(Biomarker, on_delete=models.CASCADE)
    avgMCI = models.FloatField()  # Field name made lowercase.
    sdMCI = models.FloatField()  # Field name made lowercase.
    avgHealthy = models.FloatField()  # Field name made lowercase.
    sdHealthy = models.FloatField()  # Field name made lowercase.

    def __str__(self):
        return self.biomarkerID.name
    