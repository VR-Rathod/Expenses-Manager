from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm

class RegistrationForm(UserCreationForm):
    email = forms.EmailField(required=True)
    mobile_number = forms.CharField(max_length=15)

    class Meta:
        model = User
        fields = ['username', 'email', 'mobile_number', 'password1', 'password2']

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data['email']
        user.profile.mobile_number = self.cleaned_data['mobile_number']
        if commit:
            user.save()
            user.profile.save()
        return user
