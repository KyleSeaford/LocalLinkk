from venv import logger
from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth.models import User

from ..forms import LoginForm, SignupForm

#MARK: Login
def login_view(request):
    if request.user.is_authenticated:
        return HttpResponseRedirect("/")

    login_form = LoginForm(request.POST or None)
    error_message = None

    if request.method == "POST":
        if login_form.is_valid():
            authenticated_user = authenticate(
                request,
                username=login_form.cleaned_data.get("username"),
                password=login_form.cleaned_data.get("password")
            )
            if authenticated_user is not None:
                login(request, authenticated_user)
                return HttpResponseRedirect("/")
            else:
                error_message = "Invalid username or password."

    return render(request, 'login.html', {'login_form': login_form, 'error_message': error_message})

#MARK: Sign up
def signup_view(request):
    if request.user.is_authenticated:
        return HttpResponseRedirect("/")

    if request.method == "POST":
        signup_form = SignupForm(request.POST)
        if signup_form.is_valid():
            user = User.objects.create_user(
                username=signup_form.cleaned_data.get("username"),
                email=signup_form.cleaned_data.get("email"),
                password=signup_form.cleaned_data.get("password")
            )
            # Create a default profile
            from ..models import Profile
            Profile.objects.create(user=user)
            # Send a welcome email
            authenticated_user = authenticate(
                request,
                username=signup_form.cleaned_data.get("username"),
                password=signup_form.cleaned_data.get("password")
            )
            if authenticated_user is not None:
                login(request, authenticated_user)
            return HttpResponseRedirect("/")
        else:
            return render(request, 'signup.html', {'signup_form': signup_form})
    else:
        signup_form = SignupForm()

    return render(request, 'signup.html', {'signup_form': signup_form})


#MARK: Sign out
@login_required
def signout_view(request):
    logout(request)
    return HttpResponseRedirect("/")
