from django.contrib import admin
from django.conf import settings
from django.urls import path, include
from . import views
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    path('users/', include('users.urls')),
    path('expenses/', include('expenses.urls')),
    path('api/', include('users.urls')),
    # path('api/', include('expenses.urls')),
    
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)