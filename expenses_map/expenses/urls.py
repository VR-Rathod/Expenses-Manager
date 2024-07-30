from django.urls import path
from . import views
from .views import ExpenseListCreateAPIView

urlpatterns = [
    path('expenses/', views.expense_view, name='expense'),
    path('expenses/', ExpenseListCreateAPIView.as_view(), name='expense-list-create'),
]
