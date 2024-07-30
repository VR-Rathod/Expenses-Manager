from django.shortcuts import render, redirect
from .models import Expense
from .forms import ExpenseForm
from django.contrib.auth.decorators import login_required
from rest_framework import generics
from .serializers import ExpenseSerializer
from rest_framework.permissions import IsAuthenticated

@login_required
def expense_view(request):
    if request.method == 'POST':
        form = ExpenseForm(request.POST)
        if form.is_valid():
            expense = form.save(commit=False)
            expense.user = request.user
            expense.save()
            return redirect('expense')
    else:
        form = ExpenseForm()
    expenses = Expense.objects.filter(user=request.user)
    return render(request, 'expense.html', {'form': form, 'expenses': expenses})


class ExpenseListCreateAPIView(generics.ListCreateAPIView):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Expense.objects.filter(user=user)
