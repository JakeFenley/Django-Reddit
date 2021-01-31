from django.db.models import *
from django.contrib.auth.models import User
from .validators import *
from mptt.models import MPTTModel, TreeForeignKey


class Profile(Model):
    user = OneToOneField(User, null=True, on_delete=CASCADE)
    karma = IntegerField(default=0)
    username = CharField(max_length=50)


class Subreddit(Model):
    owner = ForeignKey(
        User, related_name="subreddits", to_field="username",   on_delete=CASCADE)
    name = CharField(max_length=50, unique=True)


class Vote(Model):
    user = ForeignKey(User, on_delete=CASCADE, null=True)
    value = IntegerField(validators=[validate_score])
    submission_type = CharField(max_length=8, validators=[
        validate_submission_type])


class Post(Model):
    owner = ForeignKey(
        User, related_name="posts", to_field="username", on_delete=CASCADE, null=True)
    author_profile = ForeignKey(
        Profile, related_name="posts", to_field="user", on_delete=CASCADE, null=True)
    title = CharField(max_length=250, blank=True)
    text = CharField(max_length=4000, blank=True)
    text_sanitized = TextField(blank=True)
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
    score = IntegerField(default=0)
    subreddit = ForeignKey(Subreddit, on_delete=CASCADE)
    subreddit_name = CharField(max_length=50, null=True)
    votes = ManyToManyField(Vote, related_name="posts")
    comments_field = ManyToManyField(
        'Comment', related_name="posts")


class Comment(MPTTModel):
    owner = ForeignKey(
        User, related_name="comments", to_field="username",  on_delete=CASCADE, null=True)
    author_profile = ForeignKey(
        Profile, related_name="comments", to_field="user",   on_delete=CASCADE, null=True)
    text = CharField(max_length=4000, blank=True)
    text_sanitized = TextField(blank=True)
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
    score = IntegerField(default=0)
    votes = ManyToManyField(Vote, related_name="comments")
    parent = TreeForeignKey('self', related_name='comments_field', null=True,
                            on_delete=CASCADE, blank=True)

    class MPTTMeta:
        level_attr = 'mptt_level'
        order_insertion_by = ['-score']
