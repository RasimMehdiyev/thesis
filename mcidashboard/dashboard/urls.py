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
    path('patient/game/count/<int:pk>/', get_games_count, name='patient-games'),
    path('patient/game/total/', get_total_games, name='total-games'),
    path('patient/game/moves/<int:pk>/', get_user_moves, name='patient-moves'),
    path('patient/game/count/moves/<int:pk>/', get_total_moves_per_game_count, name='patient-moves'),
    path('patient/game/moves/count/<int:pk>/', get_user_total_moves_count, name='total-moves-count'),
    path('patient/last_session_moves/<int:pk>/', get_total_moves_last_session, name='last-session-moves'),
    path('patient/last_session_moves_num/<int:pk>/', get_total_moves_last_session_num, name='last-session-moves-num'),
    path('biomarkers_type/', get_all_biomarkers, name='biomarker-list'),
    path('biomarkers/list/',get_all_biomarkers_list, name='biomarker-list'),
    path('biomarker/histograms/<int:userID>/<int:biomarker_id>/',biomarker_frequency_histogram, name='biomarker-histograms'),
    path('game/history/<int:pk>/<int:biomarkerID>/', get_game_history_per_patient, name='game-history'),
    path('machine-learning-data/', ML_data, name='ML-data'),

]