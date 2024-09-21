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


class PersonAdmin(ImportExportModelAdmin,admin.ModelAdmin):
    resource_class = PersonResource
    list_display = ('id', 'username', 'password', 'mci', 'age','gender')
    list_filter = ['username', 'mci']
    search_fields = ['username', 'mci']
    ordering = ['username']
admin.site.register(Person, PersonAdmin)

class GameAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    resource_class = GameResource
    list_display = ('id', 'personID', 'gametime', 'issolved', 'gameseed', 'score')
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


