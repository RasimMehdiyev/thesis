from django.http import HttpResponse
from django.contrib.auth import login, authenticate
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from django.http import JsonResponse


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


from .models import Patient 
from rest_framework.decorators import api_view   
from .serializers import PatientSerializer

@api_view(['GET'])
def get_one_patient(request, pk):
    try:
        patient = Patient.objects.get(pk=pk)
        print(patient)
        serializer = PatientSerializer(patient)  # Use the serializer to serialize the patient object
        print(serializer.data)
        return Response(serializer.data)  # Return the serialized data as JSON
    except Patient.DoesNotExist:
        return Response({'error': 'Patient not found'}, status=404)
    
class PatientsView(APIView):
    def get(self, request):
        patients = Patient.objects.all()
        return Response({
            'patients': list(patients.values())
        })
    def post(self, request):
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        age = request.data.get('age')
        birth_date = request.data.get('birth_date')
        education = request.data.get('education')
        MMSE = request.data.get('MMSE')
        MoCA = request.data.get('MoCA')
        has_depression = request.data.get('has_depression')
        has_anxiety = request.data.get('has_anxiety')

        patient = Patient.objects.create(
            first_name=first_name,
            last_name=last_name,
            age=age,
            birth_date=birth_date,
            education=education,
            MMSE=MMSE,
            MoCA=MoCA,
            has_depression=has_depression,
            has_anxiety=has_anxiety
        )
        patient.save()
        return JsonResponse({
            'message': 'Patient created successfully'
        })

