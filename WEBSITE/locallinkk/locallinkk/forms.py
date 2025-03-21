from django import forms
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
import re

class LoginForm(forms.Form):
    username = forms.CharField(max_length=100)
    password = forms.CharField(max_length=100)

class SignupForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput, min_length=8)
    email = forms.EmailField()

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def clean_username(self):
        username = self.cleaned_data.get("username")
        if User.objects.filter(username=username).exists():
            raise ValidationError("This username is already taken.")
        return username
    
    def clean_email(self):
        email = self.cleaned_data.get("email")
        if User.objects.filter(email=email).exists():
            raise ValidationError("This email is already taken.")
        return email

    def clean_password(self):
        password = self.cleaned_data.get("password")
        # Add password validation rules (e.g., minimum 8 characters, at least one number)
        if len(password) < 8 or not re.search(r'\d', password):
            raise ValidationError("Password must be at least 8 characters long and contain at least one digit.")
        return password