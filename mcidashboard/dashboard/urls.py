from django.urls import path
from django.contrib.auth import views as auth_views
from .views import SignUpView, LoginView, LogoutView, UserDetailView, PatientsView

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('user/', UserDetailView.as_view(), name='user-detail'),
    path('patients/', PatientsView.as_view(), name='patient-list'),
]