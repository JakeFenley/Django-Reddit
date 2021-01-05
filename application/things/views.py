from .models import Post, Comment, Profile
from rest_framework import viewsets, permissions, generics
from .serializers import *
from rest_framework import status
from rest_framework.response import Response


class ProfileView(viewsets.ModelViewSet):
    serializer_class = ProfileSerializer


class ListHomePosts(viewsets.ModelViewSet):
    serializer_class = GetPostSerializer
    http_method_names = ['get']
    queryset = Post.objects.all()


class ListComments(viewsets.ModelViewSet):
    serializer_class = GetCommentsSerializer
    http_method_names = ['get']

    def get_queryset(self):
        queryset = Comment.objects.all()
        parent_post = self.request.GET.get('parent_post', None)
        if parent_post is not None:
            queryset = queryset.filter(parent_post=parent_post)
        return queryset


class SubredditView(viewsets.ModelViewSet):
    serializer_class = GetPostSerializer
    http_method_names = ['get']

    def get_queryset(self):
        name = self.request.GET.get('subreddit', None)
        if name is not None:
            subreddit = Subreddit.objects.get(name__icontains=name)
            posts = Post.objects.filter(subreddit_id=subreddit.id)
            return posts
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class CreateSubreddit(viewsets.ModelViewSet):
    http_method_names = ['post']
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]

    serializer_class = SubredditSerializer
    queryset = Subreddit.objects.all()

    def perform_create(self, serializer):
        serializer.is_valid(raise_exception=True)
        subreddit = serializer.save(owner=self.request.user)
        return Response(subreddit)


class CreateUpdateDestroyPost(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]

    http_method_names = ['post', 'patch', 'delete']
    serializer_class = PostSerializer_limited
    queryset = Post.objects.all()

    def perform_create(self, serializer):
        serializer.is_valid(raise_exception=True)
        profile = Profile.objects.get(user_id=self.request.user.id)
        post = serializer.save(owner=self.request.user, author_profile=profile)
        return Response(post)

    def update(self, request, *args, **kwargs):
        obj = self.get_object()
        if(obj.owner == request.user):
            serializer = PostSerializer_limited(
                instance=obj, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(status=403, data={"error": "403 Forbidden"})

    def destroy(self, request, *args, **kwargs):
        obj = self.get_object()
        if(obj.owner == request.user):
            self.perform_destroy(obj)
            return Response(status=204, data={"message": "Post deleted"})
        else:
            return Response(status=403, data={"error": "403 Forbidden"})


class CreateUpdateDestroyComment(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]
    http_method_names = ['post', 'patch', 'delete']
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()

    def perform_create(self, serializer, *args, **kwargs):
        serializer.is_valid(raise_exception=True)
        comment = serializer.save(owner=self.request.user)
        return Response({"post_id": serializer.validated_data.get('parent_post')})

    def update(self, request, *args, **kwargs):
        obj = self.get_object()
        if(obj.owner == request.user):
            serializer = CommentSerializer(
                instance=obj, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(status=403, data={"error": "403 Forbidden"})

    def destroy(self, request, *args, **kwargs):
        obj = self.get_object()
        if(obj.owner == request.user):
            self.perform_destroy(obj)
            return Response(status=204, data={"message": "Post deleted"})
        else:
            return Response(status=403, data={"error": "403 Forbidden"})


class VoteView(viewsets.ModelViewSet):
    serializer_class = VoteSerializer
    http_method_names = ['get', 'put']

    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]

    def get_queryset(self):
        qs = Vote.objects.filter(user=self.request.user)
        return qs

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
        post_id = serializer.validated_data['post_id']
        comment_id = serializer.validated_data.get('comment_id', None)
        value = serializer.validated_data['value']

        if value < -1 or value > 1:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"error": "Invalid value given"})

        if comment_id is None:
            submission = Post.objects.get(id=post_id)
        else:
            submission = Comment.objects.get(id=comment_id)

        profile = Profile.objects.get(user_id=submission.owner.id)
        user = request.user

        # Update Vote object
        if comment_id is None and Vote.objects.filter(user=user, post_id=post_id).exists():
            vote = Vote.objects.get(user=user, post_id=post_id)
            new_score = self._update_vote(vote, value, submission, profile)
            serializer.validated_data['updated_value'] = new_score
            return Response(serializer.data)

        elif comment_id is not None and Vote.objects.filter(user=user, comment_id=comment_id).exists():
            vote = Vote.objects.get(user=user, comment_id=comment_id)
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
