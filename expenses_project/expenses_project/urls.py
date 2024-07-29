from django.contrib import admin
from django.urls import path, include
from users import views as user_views  # Import your views

urlpatterns = [
    path('', user_views.home, name='home'),  # Add this line for the home page
    path('admin/', admin.site.urls),
    path('users/', include('users.urls')),  # Include the URLs from the `users` app
    path('expenses/', include('expenses.urls')),  # Include the expenses URLs
]
