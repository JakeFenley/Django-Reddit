from rest_framework import routers
from .views import *

router = routers.DefaultRouter()
router.register('r/home', ListHomePosts, 'home')
router.register('getcomments', ListComments, 'comments')
router.register('post',
                CreateUpdateDestroyPost, 'create_update_post')
router.register('comment',
                CreateUpdateDestroyComment, 'create_update_comment')
router.register('vote', VoteView, 'vote')
router.register('subreddit', SubredditView, 'subreddit_posts')
router.register('createsubreddit', CreateSubreddit, 'create_subreddit')
urlpatterns = router.urls
