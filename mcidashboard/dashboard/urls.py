from django.urls import path
from django.contrib.auth import views as auth_views
from .views import *

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('user/', UserDetailView.as_view(), name='user-detail'), 
    path('patients/', get_all_persons, name='patient-list'),
    path('patient/<int:pk>/', get_person_data, name='patient-detail'),
    path('patient/game/moves/<int:pk>/', get_user_moves, name='patient-moves'),
    path('patient/last_session_moves/<int:pk>/', get_total_moves_last_session, name='last-session-moves'),
    path('patient/last_session_moves_num/<int:pk>/', get_total_moves_last_session_num, name='last-session-moves-num'),
    path('biomarkers/', get_all_biomarkers, name='biomarker-list'),
]