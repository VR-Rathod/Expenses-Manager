from django.urls import path
from . import views  # Import views from the current app

urlpatterns = [
    path('', views.user_list, name='user_list'),  # Default route for /users/
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('profile/', views.profile, name='profile'),
]
