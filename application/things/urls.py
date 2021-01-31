from rest_framework import routers
from django.urls import path, include
from .views import *

router = routers.DefaultRouter()
router.register('r/home', ListHomePosts, 'home')
router.register('post',
                CreateUpdateDestroyPost, 'create_update_post')
router.register('comment',
                CreateUpdateDestroyComment, 'create_update_comment')
router.register('vote', VoteView, 'vote')
router.register('getSubredditPosts', SubredditPosts, 'subreddit_posts')
router.register('subreddit', SubredditView, 'subreddit')

urlpatterns = [
    path('', include(router.urls)),
    path('getPost/<int:pk>', GetPost.as_view()),
]
