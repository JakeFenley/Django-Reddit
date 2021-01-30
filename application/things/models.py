from django.db import models
from django.contrib.auth.models import User
from .validators import *
from mptt.models import MPTTModel, TreeForeignKey


class Profile(models.Model):
    user = models.OneToOneField(User, null=True, on_delete=models.CASCADE)
    karma = models.IntegerField(default=0)
    username = models.CharField(max_length=50)


class Subreddit(models.Model):
    owner = models.ForeignKey(
        User, related_name="subreddits", to_field="username",   on_delete=models.CASCADE)
    name = models.CharField(max_length=50, unique=True)


class Vote(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    value = models.IntegerField(validators=[validate_score])
    submission_type = models.CharField(max_length=8, validators=[
                                       validate_submission_type])


class Post(models.Model):
    owner = models.ForeignKey(
        User, related_name="posts", to_field="username", on_delete=models.CASCADE, null=True)
    author_profile = models.ForeignKey(
        Profile, related_name="posts", to_field="user", on_delete=models.CASCADE, null=True)
    title = models.CharField(max_length=250, blank=True)
    text = models.CharField(max_length=4000, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    score = models.IntegerField(default=0)
    subreddit = models.ForeignKey(Subreddit, on_delete=models.CASCADE)
    subreddit_name = models.CharField(max_length=50, null=True)
    votes = models.ManyToManyField(Vote, related_name="posts")
    comments_field = models.ManyToManyField(
        'Comment', related_name="posts")


class Comment(MPTTModel):
    owner = models.ForeignKey(
        User, related_name="comments", to_field="username",  on_delete=models.CASCADE, null=True)
    author_profile = models.ForeignKey(
        Profile, related_name="comments", to_field="user",   on_delete=models.CASCADE, null=True)
    text = models.CharField(max_length=4000, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    score = models.IntegerField(default=0)
    votes = models.ManyToManyField(Vote, related_name="comments")
    parent = TreeForeignKey('self', related_name='comments_field', null=True,
                            on_delete=models.CASCADE, blank=True)

    class MPTTMeta:
        level_attr = 'mptt_level'
        order_insertion_by = ['-score']
