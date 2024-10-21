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


class QuestionSerializer(serializers.ModelSerializer):
    section_title = serializers.CharField(source='section.title', read_only=True)  # Assuming section is a ForeignKey to QuestionnaireSections
    # if q_type is MC, split options into a list ';'
    class Meta:
        model = Question
        fields = ['id', 'section_title', 'question', 'q_type', 'required']

class QuestionnaireSectionSerializer(serializers.ModelSerializer):
    question_id = serializers.PrimaryKeyRelatedField(many=True, read_only=True, source='question_set')
    class Meta:
        model = QuestionnaireSections
        fields = ['id', 'questionnaire', 'title', 'description', 'question_id']

class MultipleChoiceOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MultipleChoiceOption
        fields = '__all__'

class QuestionnaireSerializer(serializers.ModelSerializer):
    sections = QuestionnaireSectionSerializer(many=True, read_only=True, source='questionnairesections_set')
    class Meta:
        model = Questionnaire
        fields = ['id', 'title', 'sections']

class ResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Response
        fields = '__all__'

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = '__all__'
