from rest_framework import serializers
from .models import *
from rest_framework_recursive.fields import RecursiveField

# Profiles


class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = '__all__'


# Votes


class VoteSerializer(serializers.ModelSerializer):
    updated_value = serializers.IntegerField(required=False, read_only=True)

    class Meta:

        model = Vote
        fields = ('value', 'updated_value', 'submission_type')


# Comments


class GetCommentsSerializer(serializers.ModelSerializer):
    votes = VoteSerializer(read_only=True, many=True)
    comments_field = RecursiveField(allow_null=True, many=True)

    class Meta:
        model = Comment
        fields = ('id', 'author_profile',  'text', 'created_at',
                  'score', 'votes', 'comments_field')
        depth = 1


class CommentSerializer(serializers.ModelSerializer):
    votes = VoteSerializer(read_only=True, many=True)
    comments_field = RecursiveField(allow_null=True, many=True, read_only=True)
    author_profile = ProfileSerializer(read_only=True)
    score = serializers.IntegerField(read_only=True)

    class Meta:
        model = Comment
        fields = ('id', 'author_profile',  'text', 'created_at',
                  'score', 'votes', 'comments_field')
        depth = 1

# Subreddits


class SubredditSerializer(serializers.ModelSerializer):

    class Meta:
        model = Subreddit
        fields = ['name', 'id']

# Posts


class GetPostSerializer(serializers.ModelSerializer):
    comments_field = GetCommentsSerializer(read_only=True, many=True)
    votes = VoteSerializer(read_only=True, many=True)

    class Meta:
        model = Post
        fields = ('id', 'author_profile', 'title', 'text', 'created_at',
                  'score', 'subreddit', 'votes', 'comments_field')
        depth = 1


class GetPostSerializer_TopLevel(serializers.ModelSerializer):
    votes = VoteSerializer(read_only=True, many=True)

    class Meta:
        model = Post
        fields = ('id', 'author_profile', 'title', 'text', 'created_at',
                  'score', 'subreddit', 'votes')
        depth = 1


class PostSerializer_limited(serializers.ModelSerializer):

    class Meta:
        model = Post
        fields = ('id', 'text', 'title', 'subreddit', 'subreddit_name')
