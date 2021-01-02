from rest_framework import serializers
from .models import *


# Profiles

class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = '__all__'


# Posts

class GetPostSerializer(serializers.ModelSerializer):

    class Meta:
        model = Post
        fields = ('id', 'owner', 'title', 'text', 'created_at',
                  'score')


class PostSerializer_limited(serializers.ModelSerializer):

    class Meta:
        model = Post
        fields = ('text', 'title', 'subreddit')

# Comments


class GetCommentsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comment
        fields = '__all__'


class CommentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comment
        fields = ('text', 'parent_comment', 'parent_post')

# Votes


class VoteSerializer(serializers.ModelSerializer):
    post_id = serializers.IntegerField()
    comment_id = serializers.IntegerField(required=False)

    class Meta:
        model = Vote
        fields = ('value', 'post_id', 'comment_id')

# Subreddits


class SubredditSerializer(serializers.ModelSerializer):

    class Meta:
        model = Subreddit
        fields = ['name', 'id']
