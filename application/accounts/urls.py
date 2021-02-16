from .views import CustomUserCreate, BlacklistTokenUpdateView
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    path('auth/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register', CustomUserCreate.as_view(), name="create_user"),
    path('auth/login', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/logout', BlacklistTokenUpdateView.as_view(),
         name='blacklist')
]
