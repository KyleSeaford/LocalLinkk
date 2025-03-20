from django.shortcuts import render

def home(request):
    return render(request, 'index.html')

def login_view(request):
    return render(request, 'login.html')

def signup_view(request):
    return render(request, 'signup.html')

def settings_view(request):
    return render(request, 'settings.html')

def help_view(request):
    return render(request, 'help.html')