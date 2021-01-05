from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    user = models.OneToOneField(User, null=True, on_delete=models.CASCADE)
    karma = models.IntegerField(default=0)
    username = models.CharField(max_length=50)


class Subreddit(models.Model):
    owner = models.ForeignKey(
        User, related_name="subreddit", to_field="username",   on_delete=models.CASCADE)
    name = models.CharField(max_length=50, unique=True)


class Post(models.Model):
    owner = models.ForeignKey(
        User, related_name="post", to_field="username",   on_delete=models.CASCADE)
    author_profile = models.ForeignKey(
        Profile, related_name="post", to_field="user",   on_delete=models.CASCADE)
    title = models.CharField(max_length=250, blank=True)
    text = models.CharField(max_length=4000, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    score = models.IntegerField(default=0)
    subreddit = models.ForeignKey(Subreddit, on_delete=models.CASCADE)
    votes = models.ManyToManyField('Vote', related_name="post_votes")


class Comment(models.Model):
    owner = models.ForeignKey(
        User, related_name="comment", to_field="username",  on_delete=models.CASCADE)
    text = models.CharField(max_length=4000, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    score = models.IntegerField(default=0)
    parent_comment = models.ForeignKey(
        'self', on_delete=models.CASCADE)
    parent_post = models.ForeignKey(Post, on_delete=models.CASCADE)


class Vote(models.Model):
    value = models.IntegerField()
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
