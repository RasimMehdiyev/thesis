from django.urls import path
from . import views

urlpatterns = [
    path('home/', views.index, name='index'),  # Map the root URL of myapp to the index view
    path('about/', views.about, name='about'),  # Map the 'about' URL to the about view
]
