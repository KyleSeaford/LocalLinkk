# myproject/urls.py
from django.urls import path
from .views import *

urlpatterns = [
    path('', home, name='home'),
    path('login/', login_view, name='login'),
    path('signup/', signup_view, name='signup'),
    path('settings/', settings_view, name='settings'),
    path('help/', help_view, name='help'),
]