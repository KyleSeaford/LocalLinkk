from django.shortcuts import render
from django.contrib.auth.decorators import login_required

def settings_view(request):
    return render(request, 'settings.html')

def help_view(request):
    return render(request, 'help.html')

@login_required(login_url='/signup/')
def home(request):
    return render(request, 'index.html')
