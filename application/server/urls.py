from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path(r'api/', include('accounts.urls')),
    path(r'api/', include('things.urls')),
    path('', include('frontend.urls')),
]
