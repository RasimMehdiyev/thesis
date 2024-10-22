from django.contrib import admin
from .models import *
from import_export.admin import ImportExportModelAdmin
from import_export import resources
# Register your models here.

class PersonResource(resources.ModelResource):
    class Meta:
        model = Person

class GameResource(resources.ModelResource):
    class Meta:
        model = Game

class MoveResource(resources.ModelResource):
    class Meta:
        model = Move


class PersonBiomarkerResource(resources.ModelResource):
    class Meta:
        model = PersonBiomarkers
    

class PersonAdmin(ImportExportModelAdmin,admin.ModelAdmin):
    resource_class = PersonResource
    list_display = ('full_name', 'id', 'username','patient_code' , 'password', 'mci', 'age','gender')
    list_filter = ['username', 'mci']
    search_fields = ['username', 'mci']
    ordering = ['username']
admin.site.register(Person, PersonAdmin)

class GameAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    resource_class = GameResource
    list_display = ('id', 'personID', 'gametime', 'issolved', 'gameseed', 'score','timestamp')
    list_filter = ['personID', 'issolved']
    search_fields = ['personID', 'issolved']
    ordering = ['personID']
admin.site.register(Game, GameAdmin)

class MoveAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    resource_class = MoveResource
    list_display = ('id', 'gameID', 'type', 'timestamp', 'time', 'accuracy', 'originstack', 'origincard', 'destinationstack', 'destinationcard', 'numberofcardsmoved', 'score', 'xcoordinate', 'ycoordinate', 'betaerror', 'rankerror', 'suiterror', 'acebetaerror', 'kingbetaerror', 'noaceonsuiterror', 'nokingonbuildstackerror')
    list_filter = ['gameID', 'type']
    search_fields = ['gameID', 'type']
    ordering = ['gameID']
admin.site.register(Move, MoveAdmin)

class BiomarkerTypeAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description')
    list_filter = ['name']
    search_fields = ['name']
    ordering = ['name']
admin.site.register(BiomarkerType, BiomarkerTypeAdmin)

class BiomarkerAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'type', 'unit')
    list_filter = ['name']
    search_fields = ['name']
    ordering = ['name']
admin.site.register(Biomarker, BiomarkerAdmin)


class BiomarkerStatsAdmin(admin.ModelAdmin):
    list_display = ('id', 'biomarkerID')
    list_filter = ['biomarkerID']
    search_fields = ['biomarkerID']
admin.site.register(BiomarkerStats, BiomarkerStatsAdmin)


class PersonBiomarkerAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    resource_class = PersonBiomarkerResource
    list_display = ('personID', 'biomarkerID', 'value')
    list_filter = ['personID', 'biomarkerID']
    search_fields = ['personID', 'biomarkerID']
    ordering = ['personID']
admin.site.register(PersonBiomarkers, PersonBiomarkerAdmin)


class QuestionnaireAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'description')
    list_filter = ['id']
    search_fields = ['id']
    ordering = ['id']
admin.site.register(Questionnaire, QuestionnaireAdmin)

class QuestionnaireSectionsAdmin(admin.ModelAdmin):
    list_display = ('id', 'questionnaire', 'title', 'title_desc','description')
    list_filter = ['questionnaire']
    search_fields = ['questionnaire']
    ordering = ['questionnaire']
admin.site.register(QuestionnaireSections, QuestionnaireSectionsAdmin)

class QuestionAdmin(admin.ModelAdmin):
    list_display = ('id', 'section', 'question', 'q_type', 'required')
    list_filter = ['section']
    search_fields = ['section']
    ordering = ['section']
admin.site.register(Question, QuestionAdmin)

class MultipleChoiceOptionAdmin(admin.ModelAdmin):
    list_display = ('id', 'question', 'option')
    list_filter = ['question']
    search_fields = ['question']
    ordering = ['question']
admin.site.register(MultipleChoiceOption, MultipleChoiceOptionAdmin)

class AnswerAdmin(admin.ModelAdmin):
    list_display = ('id', 'question', 'answer')
    list_filter = ['question']
    search_fields = ['question']
    ordering = ['question']
admin.site.register(Answer, AnswerAdmin)

class ResponseAdmin(admin.ModelAdmin):
    list_display = ('id', 'questionnaire', 'prolific_id')
    list_filter = ['questionnaire', 'prolific_id']
    search_fields = ['questionnaire', 'prolific_id']
    ordering = ['questionnaire']
admin.site.register(Response, ResponseAdmin)