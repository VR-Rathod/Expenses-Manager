from django.urls import path
from .views import expense_list
from . import views

urlpatterns = [
    path('add/', views.add_expense, name='add_expense'),  # Ensure this matches the name used in the template
    path('list/', expense_list, name='expense_list'),
]
