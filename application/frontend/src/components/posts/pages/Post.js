import { UrlMatcher } from "interweave-autolink";
import Interweave from "interweave";
import React, { Component, Fragment } from "react";
import Comments from "../components/Comments";
import PropTypes from "prop-types";
import { GlobalContext } from "../../../context/GlobalContext";
import { getPost } from "../../../api-calls/requests/getPost";
import { putVote } from "../../../api-calls/requests/putVote";
import CommentForm from "../components/CommentForm";
import "./posts.scss";
import updateCommentTree from "../updateCommentTree";
import VoteScoreWrapper from "../components/VoteScoreWrapper";
import PostTopRow from "../components/PostTopRow";

export default class Post extends Component {
  static contextType = GlobalContext;
  static propTypes = {
    vote: PropTypes.array,
    match: PropTypes.shape({
      params: PropTypes.shape({
        subreddit: PropTypes.string.isRequired,
        post: PropTypes.string.isRequired,
      }),
    }),
  };

  state = {
    post: {
      id: null,
      title: null,
      text_sanitized: null,
      score: null,
      author_profile: null,
      subreddit: null,
      created_at: null,
    },
    comments: [],
    vote: null,
    isLoading: true,
    commentFormOpen: false,
  };

  submitVote = async (postId, value) => {
    try {
      const vote = await putVote(value, postId, "post");

      this.setState((state) => {
        const updatedPost = state.post;
        updatedPost.score = vote.updated_value;
        return {
          vote: vote,
          post: updatedPost,
        };
      });
    } catch (err) {
      console.log(err);
    }
  };

  createUpdateCommentVote = (id, vote) => {
    const comments = updateCommentTree(
      this.state.comments,
      id,
      { vote: vote },
      "createUpdateCommentVote"
    );

    this.setState({ comments: comments });
  };

  addComment = (parentId, parentType, newComment) => {
    let comments;
    if (parentType === "post") {
      comments = [newComment, ...this.state.comments];
    } else {
      comments = updateCommentTree(
        this.state.comments,
        parentId,
        { newComment: newComment },
        "addComment"
      );
    }

    this.setState({ comments: comments });
  };

  componentDidMount = async () => {
    const { viewState, setViewState } = this.context;

    try {
      const { params } = this.props.match;
      const post = await getPost(parseInt(params.post));

      if (!window.location.pathname.includes(post.subreddit.name)) {
        window.location.replace(`/r/${post.subreddit.name}/${post.id}`);
      }

      this.setState({
        post: {
          id: post.id,
          title_sanitized: post.title_sanitized,
          text_sanitized: post.text_sanitized,
          author_profile: post.author_profile,
          score: post.score,
          created_at: post.created_at,
          subreddit: post.subreddit,
        },
        isLoading: false,
        vote: post.vote,
        comments: post.comments_field,
      });
      setViewState({ ...viewState, subreddit: post.subreddit.name });
    } catch (err) {
      console.log(err);
      window.location.replace("/");
    }
  };

  toggleCommentForm = () => {
    if (this.state.commentFormOpen) {
      this.setState({ commentFormOpen: false });
    } else if (this.context.userState.isAuthenticated) {
      this.setState({ commentFormOpen: true });
    }
  };

  renderDeleteButton = () => {
    const { username } = this.state.post.author_profile;
    const { userState } = this.context;

    if (username === userState.user) {
      return <button className="text-button">Delete</button>;
    } else {
      return null;
    }
  };

  render() {
    const { comments, vote, post, commentFormOpen } = this.state;

    return (
      <div className="post-view">
        <div>
          {this.state.isLoading ? (
            <div>Loading...</div>
          ) : (
            <Fragment>
              <div className="post">
                <VoteScoreWrapper
                  submission={post}
                  vote={vote}
                  submitVote={this.submitVote}
                />
                <div className="contents  ">
                  <PostTopRow post={post} />
                  <p className="title">
                    <Interweave
                      content={post.title_sanitized}
                      matchers={[new UrlMatcher("url")]}
                    />
                  </p>
                  <p>
                    <Interweave
                      content={post.text_sanitized}
                      matchers={[new UrlMatcher("url")]}
                    />
                  </p>
                  <div className="bottom-row">
                    <button
                      onClick={this.toggleCommentForm}
                      className="text-button"
                    >
                      Reply
                    </button>
                    {this.renderDeleteButton()}
                  </div>
                </div>
              </div>
              <CommentForm
                submissionId={post.id}
                submissionType="post"
                addComment={this.addComment}
                isOpen={commentFormOpen}
                toggleCommentForm={this.toggleCommentForm}
              />
              <Comments
                comments={comments}
                createUpdateCommentVote={this.createUpdateCommentVote}
                addComment={this.addComment}
              />
            </Fragment>
          )}
        </div>
      </div>
    );
  }
}
