from rest_framework import serializers
from .models import *


class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = '__all__'

class GameSerializer(serializers.ModelSerializer):
    moves = serializers.StringRelatedField(many=True, read_only=True, source='move_set')
    class Meta:
        model = Game
        fields = ['id', 'personID', 'gametime', 'issolved', 'gameseed', 'score', 'moves']
    
    def get_moves(self, obj):
        moves = obj.moves.order_by('timestamp')
        return MoveSerializer(moves, many=True).data

class MoveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Move
        fields = '__all__'

class BiomarkerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Biomarker
        fields = '__all__'

class BiomarkerTypeSerializer(serializers.ModelSerializer):
    biomarkers = BiomarkerSerializer(many=True, read_only=True, source='biomarker_set')
    
    class Meta:
        model = BiomarkerType
        fields = '__all__'



class BiomarkerStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BiomarkerStats
        fields = '__all__'



