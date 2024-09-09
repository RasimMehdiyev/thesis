from django.urls import path
from django.contrib.auth import views as auth_views
from .views import SignUpView, LoginView, LogoutView, UserDetailView, PatientsView , get_one_patient

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('user/', UserDetailView.as_view(), name='user-detail'),
    path('patients/', PatientsView.as_view(), name='patient-list'),
    path('patient/<int:pk>/', get_one_patient, name='patient-detail'),
]