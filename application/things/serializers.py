from rest_framework import serializers
from .models import *
from rest_framework_recursive.fields import RecursiveField

# Profiles


class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = '__all__'


# Comments and Posts Inheritance Model


class PostSerializerMaster(serializers.ModelSerializer):
    vote = serializers.SerializerMethodField()

    def get_vote(self, obj):
        try:
            vote = Vote.objects.get(
                user=self.context['request'].user, posts=obj.id)
            return VoteSerializer(vote).data
        except:
            return None


# Comments Serializers

class CommentSerializerMaster(serializers.ModelSerializer):
    vote = serializers.SerializerMethodField()

    def get_vote(self, obj):
        try:
            vote = Vote.objects.get(
                user=self.context['request'].user, comments=obj.id)
            return VoteSerializer(vote).data
        except:
            return None


class GetCommentsSerializer(CommentSerializerMaster):
    comments_field = RecursiveField(allow_null=True, many=True)

    class Meta:
        model = Comment
        fields = ('id', 'author_profile',  'text', 'created_at',
                  'score', 'vote', 'comments_field')
        depth = 1


class CommentSerializer(CommentSerializerMaster):
    comments_field = RecursiveField(allow_null=True, read_only=True)
    author_profile = ProfileSerializer(read_only=True)
    score = serializers.IntegerField(read_only=True)

    class Meta:
        model = Comment
        fields = ('id', 'author_profile',  'text', 'created_at',
                  'score', 'vote', 'comments_field')
        depth = 1


# Post Serializers


class GetPostSerializer(PostSerializerMaster):
    comments_field = GetCommentsSerializer(read_only=True, many=True)

    class Meta:
        model = Post
        fields = ('id', 'author_profile', 'title', 'text', 'created_at',
                  'score', 'subreddit', 'vote', 'comments_field')
        depth = 1


class GetPostSerializer_TopLevel(PostSerializerMaster):

    class Meta:
        model = Post
        fields = ('id', 'author_profile', 'title', 'text', 'created_at',
                  'score', 'subreddit', 'vote')
        depth = 1


class PostSerializer_limited(serializers.ModelSerializer):

    class Meta:
        model = Post
        fields = ('id', 'text', 'title', 'subreddit', 'subreddit_name')


# Subreddits


class SubredditSerializer(serializers.ModelSerializer):

    class Meta:
        model = Subreddit
        fields = ['name', 'id']


# Votes


class VoteSerializer(serializers.ModelSerializer):
    updated_value = serializers.IntegerField(required=False, read_only=True)

    class Meta:

        model = Vote
        fields = ('value', 'updated_value', 'submission_type')
