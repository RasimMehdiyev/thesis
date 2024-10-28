from django.http import HttpResponse
from django.contrib.auth import login, authenticate
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from django.http import JsonResponse
from rest_framework.decorators import api_view  
from collections import Counter
from .models import * 
from .serializers import *
from django.db.models import Count, Avg
from django.db.models import Max
import matplotlib.pyplot as plt
from collections import defaultdict
from collections import Counter

# Create your views here.
def index(request):
    return HttpResponse("Welcome to the Index Page")

def about(request):
    return HttpResponse("Welcome to the About Page")


from rest_framework.permissions import IsAuthenticated, IsAdminUser

class SignUpView(APIView):
    permission_classes = [IsAdminUser]
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, password=password, email=email)
        user.save()
        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    # only staff can access this view
    # permission_classes = [AllowAny]
    def post(self, request):
        # Check if the user is an admin
        if not request.user.is_staff:
            if request.headers.get('X-Custom-Token') != 'admin_power':
                self.permission_classes = [IsAdminUser]
                return Response({'error': 'Only admins can access this URL'}, status=status.HTTP_403_FORBIDDEN)

        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return Response({'message': 'Login successful'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

            


class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)

class UserDetailView(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            return JsonResponse({
                'username': request.user.username,
                'email': request.user.email,
            })
        else:
            return JsonResponse({'error': 'Not authenticated'}, status=401)

@api_view(['GET'])
def get_person_data(request, pk):
    person = Person.objects.get(pk=pk)
    serializer = PersonSerializer(person)
    return JsonResponse(serializer.data)
@api_view(['GET'])
def get_all_persons(request):
    persons = Person.objects.all()
    serializer = PersonSerializer(persons, many=True)
    return JsonResponse(serializer.data, safe=False)

@api_view(['GET'])
def get_user_moves(request, pk):
    user = Person.objects.get(pk=pk)
    games = Game.objects.filter(personID=user)
    serializer = GameSerializer(games, many=True)
    return JsonResponse(serializer.data, safe=False)

@api_view(['GET'])
def get_user_total_moves_count(request, pk):
    user = Person.objects.get(pk=pk)
    games = Game.objects.filter(personID=user)
    moves = Move.objects.filter(gameID__in=games)
    move_count = moves.count()
    return JsonResponse({'total_moves': move_count}, safe=False)

@api_view(['GET'])
def get_games_count(request, pk):
    user = Person.objects.get(pk=pk)
    games = Game.objects.filter(personID=user)
    return JsonResponse({'total_games': games.count()}, safe=False)

@api_view(['GET'])
def get_total_games(request):
    # Aggregate total number of games per user
    total_games_per_user = (
        Person.objects.annotate(total_games=Count('game'))
        .values('id', 'username', 'total_games')
    )
    
    # Format the response
    response_data = [
        {
            'user': person['username'],
            'total_games': person['total_games']
        }
        for person in total_games_per_user
    ]
    
    return JsonResponse(response_data, safe=False)


@api_view(['GET'])
def get_total_moves_last_session(request, pk):
    user = Person.objects.get(pk=pk)
    games = Game.objects.filter(personID=user)
    moves = Move.objects.filter(gameID__in=games)
    serializer = MoveSerializer(moves, many=True)
    return JsonResponse(serializer.data, safe=False)

@api_view(['GET'])
def get_total_moves_last_session_num(request, pk):
    # Check if the user with the given pk exists
    if not Person.objects.filter(pk=pk).exists():
        return JsonResponse({'error': 'User does not exist'}, status=404)
    
    # Get the user if exists
    user = Person.objects.get(pk=pk)
    
    # Get the last game based on the timestamp (if not null)
    last_game = Game.objects.filter(personID=user).order_by('-timestamp').first()
    
    if last_game:
        # Count the number of moves for the last game
        move_count = Move.objects.filter(gameID=last_game).count()
        
        # Return the count as JSON response
        return JsonResponse({'total_moves': move_count}, safe=False)
    else:
        return JsonResponse({'error': 'No games found for user'}, status=404)
    
@api_view(['GET'])
def get_total_moves_per_game_count(request, pk):
    game = Game.objects.get(pk=pk)
    moves = Move.objects.filter(gameID=game)
    move_count = moves.count()
    return JsonResponse({'total_moves': move_count}, safe=False)

@api_view(['GET'])
def get_all_biomarkers_list(request):
    biomarkers = Biomarker.objects.all()
    serializer = BiomarkerSerializer(biomarkers, many=True)
    return JsonResponse(serializer.data, safe=False)

@api_view(['GET'])
def get_all_biomarkers(request):
    biomarkers = BiomarkerType.objects.all()
    serializer = BiomarkerTypeSerializer(biomarkers, many=True)
    return JsonResponse(serializer.data, safe=False)

@api_view(['GET'])
def biomarker_frequency_histogram(request, userID, biomarker_id):

    try:
        user = Person.objects.get(id=userID)
    except Person.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)


    last_game_user = Game.objects.filter(personID=user).order_by('-timestamp').first()

    current_user_biomarker_value = None

    if last_game_user:
        current_user_biomarker_value = PersonBiomarkers.objects.filter(
            biomarkerID=biomarker_id, gameID=last_game_user
        ).values_list('value', flat=True).first()
        current_user_biomarker_value = round(current_user_biomarker_value, 2) if isinstance(current_user_biomarker_value, float) else current_user_biomarker_value

    if current_user_biomarker_value is None:
        current_user_biomarker_value = 0

    healthy_users = Person.objects.filter(mci=0)
    healthy_last_games_subquery = Game.objects.filter(personID__in=healthy_users).values('personID').annotate(
        last_game_timestamp=Max('timestamp')
    ).values_list('personID', 'last_game_timestamp')

    healthy_last_games = Game.objects.filter(personID__in=healthy_users).filter(
        timestamp__in=[t[1] for t in healthy_last_games_subquery]
    )

    mci_users = Person.objects.filter(mci=1)
    mci_last_games_subquery = Game.objects.filter(personID__in=mci_users).values('personID').annotate(
        last_game_timestamp=Max('timestamp')
    ).values_list('personID', 'last_game_timestamp')

    mci_last_games = Game.objects.filter(personID__in=mci_users).filter(
        timestamp__in=[t[1] for t in mci_last_games_subquery]
    )


    mci_biomarker_values = PersonBiomarkers.objects.filter(biomarkerID=biomarker_id, gameID__in=mci_last_games).values_list('value', flat=True)
    healthy_biomarker_values = PersonBiomarkers.objects.filter(biomarkerID=biomarker_id, gameID__in=healthy_last_games).values_list('value', flat=True)

    mci_biomarker_frequency = Counter(mci_biomarker_values)
    healthy_biomarker_frequency = Counter(healthy_biomarker_values)


    mci_biomarker_frequency_list = [{'biomarker_value': round(value, 2) if isinstance(value, float) else value, 'frequency': frequency} for value, frequency in mci_biomarker_frequency.items()]
    healthy_biomarker_frequency_list = [{'biomarker_value': round(value, 2) if isinstance(value, float) else value, 'frequency': frequency} for value, frequency in healthy_biomarker_frequency.items()]


    mci_biomarker_frequency_list = sorted(mci_biomarker_frequency_list, key=lambda x: x['biomarker_value'])
    healthy_biomarker_frequency_list = sorted(healthy_biomarker_frequency_list, key=lambda x: x['biomarker_value'])


    return JsonResponse({
        'current_user': {
            'biomarker_value': current_user_biomarker_value,
            'mci': user.mci
        },
        'mci': mci_biomarker_frequency_list,
        'healthy': healthy_biomarker_frequency_list
    }, safe=False)

@api_view(['GET'])
def get_game_history_per_patient(request, pk, biomarkerID):
    person = Person.objects.get(pk=pk)
    
    games = Game.objects.filter(personID=person)
    
    biomarker = Biomarker.objects.get(pk=biomarkerID)
    
    biomarker_values = PersonBiomarkers.objects.filter(gameID__in=games, biomarkerID=biomarker)
    
    biomarker_values_list = list(biomarker_values.values_list('value', flat=True))
     
    game_history = {
        game.timestamp: round(value, 2) if isinstance(value, float) else value
        for game, value in zip(games, biomarker_values_list)
    }
    
    return JsonResponse(game_history, safe=False)

from django.db.models import Count, Avg, StdDev

@api_view(['GET'])
def ML_data(request):
    total_games = Game.objects.count()

    patients = Person.objects.all()
    mci_patients = patients.filter(mci=1).count()
    healthy_patients = patients.filter(mci=0).count()

    mci_avg_age = patients.filter(mci=1).aggregate(avg_age=Avg('age'))['avg_age']
    healthy_avg_age = patients.filter(mci=0).aggregate(avg_age=Avg('age'))['avg_age']

    total_moves = Move.objects.count()

    meanSD_MMSE_score_healthy = Person.objects.filter(mci=0).aggregate(
        avg_MMSE=Avg('MMSE'), sd_MMSE=StdDev('MMSE'))
    meanSD_MMSE_score_mci = Person.objects.filter(mci=1).aggregate(
        avg_MMSE=Avg('MMSE'), sd_MMSE=StdDev('MMSE'))

    meanSD_MoCA_score_healthy = Person.objects.filter(mci=0).aggregate(
        avg_MoCA=Avg('MoCA'), sd_MoCA=StdDev('MoCA'))
    meanSD_MoCA_score_mci = Person.objects.filter(mci=1).aggregate(
        avg_MoCA=Avg('MoCA'), sd_MoCA=StdDev('MoCA'))

    meanSD_age_healthy = Person.objects.filter(mci=0).aggregate(
        avg_age=Avg('age'), sd_age=StdDev('age'))
    meanSD_age_mci = Person.objects.filter(mci=1).aggregate(
        avg_age=Avg('age'), sd_age=StdDev('age'))

    # percentage of male and female mci
    male_mci = Person.objects.filter(mci=1).filter(gender="Man").count() / mci_patients
    female_mci = 100 - 100 * male_mci

    # percentage of male and female healthy
    male_healthy = Person.objects.filter(mci=0).filter(gender='Man').count() / healthy_patients
    female_healthy = 100 - 100 * male_healthy

    # Education and proficiency mappings
    education_labels = {
        '1': 'ISCED 1/2',
        '2': 'ISCED 3/4',
        '3': 'ISCED 5/6'
    }

    tablet_and_cardgame_proficiency = {
        '1': 'Daily',
        '2': 'Weekly',
        '3': 'Monthly',
        '4': 'Yearly or less',
        '5': 'Never'
    }

    # Fetch and calculate tablet and card game proficiency levels
    tablet_level_mci = Person.objects.filter(mci=1).values('tabletlevel').annotate(count=Count('tabletlevel'))
    tablet_level_healthy = Person.objects.filter(mci=0).values('tabletlevel').annotate(count=Count('tabletlevel'))
    cardgame_level_mci = Person.objects.filter(mci=1).values('playlevel').annotate(count=Count('playlevel'))
    cardgame_level_healthy = Person.objects.filter(mci=0).values('playlevel').annotate(count=Count('playlevel'))

    # Ensure that all levels are present and sorted according to the proficiency mappings
    def calculate_percentage(data, total, labels):
        result = []
        for key, label in labels.items():
            found = next((item for item in data if item.get('tabletlevel') == key or item.get('playlevel') == key), None)
            count = found['count'] if found else 0
            percentage = round((count / total) * 100, 2) if total > 0 else 0
            result.append({'label': label, 'data': percentage})
        return result

    tablet_level_mci_percentage = calculate_percentage(tablet_level_mci, mci_patients, tablet_and_cardgame_proficiency)
    tablet_level_healthy_percentage = calculate_percentage(tablet_level_healthy, healthy_patients, tablet_and_cardgame_proficiency)
    cardgame_level_mci_percentage = calculate_percentage(cardgame_level_mci, mci_patients, tablet_and_cardgame_proficiency)
    cardgame_level_healthy_percentage = calculate_percentage(cardgame_level_healthy, healthy_patients, tablet_and_cardgame_proficiency)

    # Education levels
    education_level_mci = Person.objects.filter(mci=1).values('education_level').annotate(count=Count('education_level'))
    education_level_healthy = Person.objects.filter(mci=0).values('education_level').annotate(count=Count('education_level'))

    # Ensure that all education levels are present and sorted
    def calculate_education_percentage(data, total, labels):
        result = []
        for key, label in labels.items():
            found = next((item for item in data if item['education_level'] == key), None)
            count = found['count'] if found else 0
            percentage = round((count / total) * 100, 2) if total > 0 else 0
            result.append({'label': label, 'data': percentage})
        return result

    education_level_mci_percentage = calculate_education_percentage(education_level_mci, mci_patients, education_labels)
    education_level_healthy_percentage = calculate_education_percentage(education_level_healthy, healthy_patients, education_labels)

    # Gender percentages
    gender_mci_percentage = [
        {'label': 'Male', 'data': round(male_mci * 100, 2)},
        {'label': 'Female', 'data': round(female_mci, 2)}
    ]
    gender_healthy_percentage = [
        {'label': 'Male', 'data': round(male_healthy * 100, 2)},
        {'label': 'Female', 'data': round(female_healthy, 2)}
    ]

    # Total time
    games = Game.objects.all()
    total_time = sum([game.gametime for game in games]) / 60000
    total_time = round(total_time, 1)

    # Combine data
    combined_data = {
        'total_games': total_games,
        'patients': {
            'mci': mci_patients,
            'healthy': healthy_patients,
            'mci_avg_age': round(mci_avg_age, 0) if mci_avg_age else None,
            'healthy_avg_age': round(healthy_avg_age, 0) if healthy_avg_age else None,
            'meanSD_MMSE_score_healthy': {
                'mean': round(meanSD_MMSE_score_healthy['avg_MMSE'], 2) if meanSD_MMSE_score_healthy['avg_MMSE'] is not None else None,
                'sd': round(meanSD_MMSE_score_healthy['sd_MMSE'], 2) if meanSD_MMSE_score_healthy['sd_MMSE'] is not None else None
            },
            'meanSD_MMSE_score_mci': {
                'mean': round(meanSD_MMSE_score_mci['avg_MMSE'], 2) if meanSD_MMSE_score_mci['avg_MMSE'] is not None else None,
                'sd': round(meanSD_MMSE_score_mci['sd_MMSE'], 2) if meanSD_MMSE_score_mci['sd_MMSE'] is not None else None
            },
            'meanSD_MoCA_score_healthy': {
                'mean': round(meanSD_MoCA_score_healthy['avg_MoCA'], 2) if meanSD_MoCA_score_healthy['avg_MoCA'] is not None else None,
                'sd': round(meanSD_MoCA_score_healthy['sd_MoCA'], 2) if meanSD_MoCA_score_healthy['sd_MoCA'] is not None else None
            },
            'meanSD_MoCA_score_mci': {
                'mean': round(meanSD_MoCA_score_mci['avg_MoCA'], 2) if meanSD_MoCA_score_mci['avg_MoCA'] is not None else None,
                'sd': round(meanSD_MoCA_score_mci['sd_MoCA'], 2) if meanSD_MoCA_score_mci['sd_MoCA'] is not None else None
            },
            'meanSD_age_healthy': {
                'mean': round(meanSD_age_healthy['avg_age'], 2) if meanSD_age_healthy['avg_age'] is not None else None,
                'sd': round(meanSD_age_healthy['sd_age'], 2) if meanSD_age_healthy['sd_age'] is not None else None
            },
            'meanSD_age_mci': {
                'mean': round(meanSD_age_mci['avg_age'], 2) if meanSD_age_mci['avg_age'] is not None else None,
                'sd': round(meanSD_age_mci['sd_age'], 2) if meanSD_age_mci['sd_age'] is not None else None
            },
            'education_level_mci': education_level_mci_percentage,
            'education_level_healthy': education_level_healthy_percentage,
            'gender_mci': gender_mci_percentage,
            'gender_healthy': gender_healthy_percentage,
            'tablet_level_mci': tablet_level_mci_percentage,
            'tablet_level_healthy': tablet_level_healthy_percentage,
            'cardgame_level_mci': cardgame_level_mci_percentage,
            'cardgame_level_healthy': cardgame_level_healthy_percentage
        },
        'total_moves': total_moves,
        'total_game_time': total_time,
    }

    return JsonResponse(combined_data, safe=False)

@api_view(['GET'])
def get_questionnaire_sections(request, pk):
    try:
        questionnaire = Questionnaire.objects.get(pk=pk)
        sections = questionnaire.questionnairesections_set.all()
        serializer = QuestionnaireSectionSerializer(sections, many=True)
        return JsonResponse(serializer.data, safe=False)
    except Questionnaire.DoesNotExist:
        return JsonResponse({'error': 'Questionnaire not found'}, status=404)


@api_view(['GET'])
def get_questions_by_section(request, section_id):
    section = QuestionnaireSections.objects.get(pk=section_id)
    questions = section.question_set.all()
    serializer = QuestionSerializer(questions, many=True)
    return JsonResponse(serializer.data, safe=False)

@api_view(['GET'])
def get_options(request, question_id):
    question = Question.objects.get(pk=question_id)
    if question.q_type == 'MC':
        options = question.multiplechoiceoption_set.all()
        serializer = MultipleChoiceOptionSerializer(options, many=True)
        # take the option field from the serializer and put it in a list
        option_list = [option['option'] for option in serializer.data]
        return JsonResponse(option_list, safe=False)
    elif question.q_type == 'Scale':
        options = ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree']
        return JsonResponse(options, safe=False)
    else:
        return JsonResponse({'error': 'This is an open ended question!'}, status=400)

from django.views.decorators.csrf import csrf_exempt
@csrf_exempt
@api_view(['POST'])
def create_response(request):
    if request.method == 'POST':
        try:
            prolific_id = request.data.get('prolific_id')
            questionnaire_id = request.data.get('questionnaire')

            # Validate that required data is provided
            if not prolific_id or not questionnaire_id:
                return JsonResponse(
                    {'error': 'prolific_id and questionnaire are required fields.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Check if a response with the same prolific_id already exists
            if Response.objects.filter(prolific_id=prolific_id).exists():
                response = Response.objects.get(prolific_id=prolific_id)
                print(response.id)
                return JsonResponse({'response_id': response.id}, status=status.HTTP_200_OK)
            
            # Retrieve the questionnaire, handle if it doesn't exist
            try:
                questionnaire = Questionnaire.objects.get(pk=questionnaire_id)
            except Questionnaire.DoesNotExist:
                return JsonResponse(
                    {'error': f'Questionnaire with id {questionnaire_id} does not exist.'},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Create a new response
            response = Response.objects.create(questionnaire=questionnaire, prolific_id=prolific_id)
            response.save()
            
            return JsonResponse({'response_id': response.id}, status=status.HTTP_201_CREATED)

        except Exception as e:
            # Catch-all for unexpected errors
            return JsonResponse(
                {'error': f'An unexpected error occurred: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

@csrf_exempt
@api_view(['POST'])
def add_answer(request, response_id):
    answers = request.data.get('sectionsToSubmit')
    # example of answers format to be sent in the request body 
    # [ { "question": 1, "answer": "option1" }, { "question": 2, "answer": "option2" } ]
    print(answers)
    response = Response.objects.get(pk=response_id)
    for answer in answers:
        question = Question.objects.get(pk=answer['question'])

        # check if answer already exists by checking the question id from the response, if yes just update the answer
        if Answer.objects.filter(response=response, question=question).exists():
            answer_instance = Answer.objects.get(response=response, question=question)
            answer_instance.answer = answer['answer']
            answer_instance.save()
        else:
            Answer.objects.create(response=response, question=question, answer=answer['answer'])
    return JsonResponse({'message': 'Answers added successfully'}, status=201)

@api_view(['GET'])
def get_answers_by_prolific_id(request, prolific_id):
    response = Response.objects.get(prolific_id=prolific_id)
    answers = response.answer_set.all()
    serializer = AnswerSerializer(answers, many=True)
    return JsonResponse(serializer.data, safe=False)
