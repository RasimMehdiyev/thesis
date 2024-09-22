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
from .models import * 
from .serializers import *


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
def get_all_biomarkers(request):
    biomarkers = BiomarkerType.objects.all()
    serializer = BiomarkerTypeSerializer(biomarkers, many=True)
    return JsonResponse(serializer.data, safe=False)

