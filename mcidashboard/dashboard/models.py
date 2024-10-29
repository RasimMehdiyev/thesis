from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

# Create your models here.
class Game(models.Model):
    id = models.BigAutoField(primary_key=True)
    personID = models.ForeignKey('Person', on_delete=models.CASCADE)  
    gametime = models.IntegerField(db_column='gameTime')  
    issolved = models.IntegerField(db_column='isSolved')  
    gameseed = models.IntegerField()
    score = models.BigIntegerField()
    timestamp = models.BigIntegerField(blank=True, null=True)

    def __str__(self):
        return str(self.id)



class Move(models.Model):
    id = models.BigAutoField(primary_key=True)
    gameID = models.ForeignKey(Game, on_delete=models.CASCADE)  
    type = models.CharField(max_length=20)
    timestamp = models.BigIntegerField(blank=True, null=True)
    time = models.BigIntegerField()
    accuracy = models.CharField(max_length=10)
    originstack = models.CharField(db_column='originStack', max_length=10)  
    origincard = models.CharField(db_column='originCard', max_length=10)  
    destinationstack = models.CharField(db_column='destinationStack', max_length=10)  
    destinationcard = models.CharField(db_column='destinationCard', max_length=10)  
    numberofcardsmoved = models.IntegerField(db_column='numberOfCardsMoved')  
    score = models.IntegerField()
    xcoordinate = models.FloatField(db_column='xCoordinate')  
    ycoordinate = models.FloatField(db_column='yCoordinate')  
    betaerror = models.IntegerField(db_column='betaError')  
    rankerror = models.IntegerField(db_column='rankError')  
    suiterror = models.IntegerField(db_column='suitError')  
    acebetaerror = models.IntegerField(db_column='aceBetaError')  
    kingbetaerror = models.IntegerField(db_column='kingBetaError')  
    noaceonsuiterror = models.IntegerField(db_column='noAceOnSuitError')  
    nokingonbuildstackerror = models.IntegerField(db_column='noKingOnBuildStackError')  

    def __str__(self):
        return "Game ID: " + str(self.gameID.id) + ' | Move type: ' + self.type


class Person(models.Model):

    EDUCATION_LEVELS = (
        ('1' , 'ISCED 1/2'),
        ('2' , 'ISCED 3/4'),
        ('3' , 'ISCED 5/6'),
    )

    TABLET_PROFICIENCY = (
    ('1', 'Dagelijks'),
    ('2', 'Wekelijks'),
    ('3', 'Maandelijks'),
    ('4', 'Jaarlijks'),
    ('5', 'Nooit'),
    )

    CARDGAME_PROFICIENCY = (
    ('1', 'Dagelijks'),
    ('2', 'Wekelijks'),
    ('3', 'Maandelijks'),
    ('4', 'Jaarlijks'),
    ('5', 'Nooit'),
    )


    id = models.BigAutoField(primary_key=True)
    full_name = models.CharField(max_length=64, blank=True, null=True)
    username = models.CharField(max_length=45)
    password = models.CharField(max_length=45)
    mci = models.IntegerField(db_column='MCI')  # Field name made lowercase.
    age = models.IntegerField()
    gender = models.CharField(max_length=10)
    playlevel = models.CharField(db_column='playLevel', max_length=1, choices=CARDGAME_PROFICIENCY)  # Field name made lowercase.
    tabletlevel = models.CharField(db_column='tabletLevel', max_length=1, choices=TABLET_PROFICIENCY)  # Field name made lowercase.
    patient_code = models.CharField(max_length=45, blank=True, null=True)
    MMSE = models.IntegerField( blank=True, null=True, validators=[MinValueValidator(0), MaxValueValidator(30)])
    MoCA = models.FloatField(blank=True, null=True, validators=[MinValueValidator(0), MaxValueValidator(30)])
    education_level = models.CharField(max_length=1, choices=EDUCATION_LEVELS, blank=True, null=True)

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
    description = models.TextField(blank=True, null=True)
    def __str__(self):
        return self.name


class BiomarkerStats(models.Model):
    id = models.BigAutoField(primary_key=True)
    biomarkerID = models.ForeignKey(Biomarker, on_delete=models.CASCADE)
    avgMCI = models.FloatField()  # Field name made lowercase.
    sdMCI = models.FloatField()  # Field name made lowercase.
    avgHealthy = models.FloatField()  # Field name made lowercase.
    sdHealthy = models.FloatField()  

    def __str__(self):
        return self.biomarkerID.name
    
class PersonBiomarkers(models.Model):
    id = models.BigAutoField(primary_key=True)
    personID = models.ForeignKey(Person, on_delete=models.CASCADE)
    gameID = models.ForeignKey(Game, on_delete=models.CASCADE,  null=True, blank=True)
    biomarkerID = models.ForeignKey(Biomarker, on_delete=models.CASCADE)
    value = models.FloatField()

    def __str__(self):
        return self.personID.username + ' | ' + self.biomarkerID.name
    

class Questionnaire(models.Model):
    id = models.BigAutoField(primary_key=True)
    title = models.CharField(max_length=45)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return str(self.id)


class QuestionnaireSections(models.Model):
    id = models.BigAutoField(primary_key=True)
    questionnaire = models.ForeignKey(Questionnaire, on_delete=models.CASCADE)
    title = models.CharField(max_length=45)
    description = models.TextField(blank=True, null=True)
    title_desc = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.title
    
    
class Question(models.Model):
    QUESTION_TYPES = (
        ('MC', 'Multiple Choice'),
        ("OE", "Open Ended"),
        ("SC", "Scale"),
    )
    id = models.BigAutoField(primary_key=True)
    section = models.ForeignKey(QuestionnaireSections, on_delete=models.CASCADE, null=True, blank=True)
    question = models.TextField()
    q_type = models.CharField(max_length=2, choices=QUESTION_TYPES)
    required = models.BooleanField(default=True)
    charLimit = models.IntegerField(blank=True, null=True)
    noSpecialChars = models.BooleanField(default=False)

    def __str__(self):
        return self.section.title + ' | ' + self.question[:20]
    
class MultipleChoiceOption(models.Model):
    id = models.BigAutoField(primary_key=True)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    option = models.TextField()

    def __str__(self):
        return self.option
    
class Response(models.Model):
    id = models.BigAutoField(primary_key=True)
    questionnaire = models.ForeignKey(Questionnaire, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    prolific_id = models.CharField(max_length=45, blank=True, null=True)

    def __str__(self):
        return self.prolific_id
    
class Answer(models.Model):
    id = models.BigAutoField(primary_key=True)
    response = models.ForeignKey(Response, on_delete=models.CASCADE, null=True, blank=True)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    answer = models.TextField()

    def __str__(self):
        return f'Answer to {self.question}'
    

class MLModelData(models.Model):
    model_name = models.CharField(max_length=45)
    model_F1_score = models.FloatField()
    true_positive = models.IntegerField()
    false_positive = models.IntegerField()
    true_negative = models.IntegerField()
    false_negative = models.IntegerField()

    def __str__(self):
        return self.model_name