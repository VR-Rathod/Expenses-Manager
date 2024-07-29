from django.db import models
from users.models import User  # Ensure this import is correct

class Expense(models.Model):
    SPLIT_METHODS = [
        ('equal', 'Equal'),
        ('exact', 'Exact'),
        ('percentage', 'Percentage'),
    ]

    payer = models.ForeignKey(User, related_name='expenses_paid', on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    split_method = models.CharField(max_length=10, choices=SPLIT_METHODS)
    description = models.CharField(max_length=255)
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.payer} paid {self.amount} for {self.description}"
