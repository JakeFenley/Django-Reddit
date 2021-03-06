from .models import Post, Comment, Profile
from rest_framework import viewsets, permissions, generics
from rest_framework.generics import RetrieveAPIView
from .serializers import *
from rest_framework import status
from rest_framework.response import Response
from django.http import Http404
from itertools import chain
from django.db.models import Prefetch
from django.utils.html import escape
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.utils.decorators import method_decorator


class ListHomePosts(viewsets.ModelViewSet):
    serializer_class = GetPostSerializer_TopLevel
    http_method_names = ['get']
    queryset = Post.objects.all().order_by('-score')


class GetPost(RetrieveAPIView):
    serializer_class = GetPostSerializer
    queryset = Post.objects.all()


class SubredditPosts(viewsets.ModelViewSet):
    serializer_class = GetPostSerializer_TopLevel
    http_method_names = ['get']

    def get_queryset(self):
        name = self.request.GET.get('subreddit', None)

        try:
            subreddit = Subreddit.objects.get(name__icontains=name)
            posts = Post.objects.filter(
                subreddit_id=subreddit.id).order_by('-score')
            return posts
        except:
            raise Http404


class CreateUpdateDestroyPost(viewsets.ModelViewSet):

    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]

    serializer_class = PostSerializer_limited
    queryset = Post.objects.all()

    def perform_create(self, serializer):
        serializer.is_valid(raise_exception=True)
        profile = Profile.objects.get(user_id=self.request.user.id)
        title_sanitized = escape(serializer.validated_data['title'])
        text_sanitized = escape(serializer.validated_data['text'])

        if Subreddit.objects.filter(name=serializer.validated_data['subreddit_name']).exists():
            post = serializer.save(
                owner=self.request.user,
                author_profile=profile,
                text_sanitized=text_sanitized,
                title_sanitized=title_sanitized
            )
            return Response(post)

        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        obj = self.get_object()

        if(obj.owner == request.user):
            serializer = PostSerializer_limited(
                instance=obj, data=request.data, partial=True)
            text_sanitized = escape(serializer.validated_data['text'])
            serializer.is_valid(raise_exception=True)
            serializer.save(text_sanitized=text_sanitized)
            return Response(serializer.data)

        else:
            return Response(status=403, data={"error": "403 Forbidden"})

    def destroy(self, request, *args, **kwargs):
        obj = self.get_object()
        if(obj.owner == request.user):
            self.perform_destroy(obj)
            return Response(status=status.HTTP_204_NO_CONTENT, data={"message": "Post deleted"})

        else:
            return Response(status=status.HTTP_403_FORBIDDEN, data={"error": "403 Forbidden"})


class SubredditView(viewsets.ModelViewSet):
    http_method_names = ['post', 'get']
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]

    serializer_class = SubredditSerializer
    queryset = Subreddit.objects.all()

    def perform_create(self, serializer):
        serializer.is_valid(raise_exception=True)
        subreddit = serializer.save(owner=self.request.user)
        return Response(subreddit)


class CreateUpdateDestroyComment(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()

    def perform_create(self, serializer, *args, **kwargs):
        serializer.is_valid(raise_exception=True)
        profile = Profile.objects.get(user_id=self.request.user.id)
        post_id = self.request.GET.get('post_id', None)
        comment_id = self.request.GET.get('comment_id', None)
        text_sanitized = escape(serializer.validated_data['text'])
        try:

            if post_id is not None:
                parent = Post.objects.get(
                    id=post_id)

                comment = serializer.save(
                    owner=self.request.user,
                    author_profile=profile,
                    text_sanitized=text_sanitized)

                parent.comments_field.add(comment)
                parent.save()

            elif comment_id is not None:
                parent = Comment.objects.get(
                    id=comment_id)

                comment = serializer.save(
                    owner=self.request.user,
                    author_profile=profile,
                    parent=parent,
                    text_sanitized=text_sanitized)

            return Response(status=status.HTTP_200_OK, data=serializer.data)

        except:

            return Response(status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        obj = self.get_object()

        if(obj.owner == request.user):
            serializer = CommentSerializer(
                instance=obj, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            text_sanitized = escape(serializer.validated_data['text'])
            serializer.save(text_sanitized=text_sanitized)
            return Response(serializer.data)

        else:
            return Response(status=403, data={"error": "403 Forbidden"})

    def destroy(self, request, *args, **kwargs):
        obj = self.get_object()
        if(obj.owner == request.user):
            self.perform_destroy(obj)
            return Response(status=status.HTTP_204_NO_CONTENT, data={"message": "Post deleted"})

        else:
            return Response(status=status.HTTP_403_FORBIDDEN, data={"error": "403 Forbidden"})


class VoteView(viewsets.ModelViewSet):
    serializer_class = VoteSerializer
    http_method_names = ['put']

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def _update_vote(self, vote, value, submission, profile):
        if vote.value == value:
            change = 0

        else:
            change = vote.value * -1 + value

        vote.value = value
        submission.score += change
        profile.karma += change
        submission.save()
        profile.save()
        vote.save()
        return submission.score

    def put(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data)
        serializer.is_valid(raise_exception=True)
        post_id = request.GET.get('post_id', None)
        comment_id = request.GET.get('comment_id', None)
        value = serializer.validated_data['value']
        s_type = serializer.validated_data['submission_type']

        try:
            if s_type == "post":
                submission = Post.objects.get(id=post_id)
            else:
                submission = Comment.objects.get(id=comment_id)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

        profile = Profile.objects.get(user_id=submission.owner.id)
        user = request.user

        # Update Vote object
        if post_id is not None and Vote.objects.filter(user_id=user, posts__id=post_id).exists():
            vote = Vote.objects.get(user=user, posts__id=post_id)
            new_score = self._update_vote(vote, value, submission, profile)
            serializer.validated_data['updated_value'] = new_score
            return Response(serializer.data)

        elif comment_id is not None and Vote.objects.filter(user=user, comments__id=comment_id).exists():
            vote = Vote.objects.get(user=user, comments__id=comment_id)
            new_score = self._update_vote(vote, value, submission, profile)
            serializer.validated_data['updated_value'] = new_score
            return Response(serializer.data)

        # Create new Vote object if none exists
        new_serializer = self.get_serializer(
            data=request.data)
        new_serializer.is_valid(raise_exception=True)
        vote = serializer.save(user=user)
        submission.score += value
        new_serializer.validated_data['updated_value'] = submission.score
        profile.karma += value
        submission.votes.add(vote)
        submission.save()
        profile.save()
        return Response(new_serializer.data)
