from .views import CustomUserCreate, BlacklistTokenUpdateView,  CookieTokenRefreshView, CookieTokenObtainPairView
from django.urls import path, include


urlpatterns = [
    path('auth/token/refresh', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register', CustomUserCreate.as_view(), name="create_user"),
    path('auth/login', CookieTokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path('auth/logout', BlacklistTokenUpdateView.as_view(),
         name='blacklist')
]
