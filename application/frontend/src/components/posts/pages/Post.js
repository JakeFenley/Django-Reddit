import { UrlMatcher } from "interweave-autolink";
import Interweave from "interweave";
import React, { Component } from "react";
import Comments from "../components/Comments";
import PropTypes from "prop-types";
import { GlobalContext } from "../../../context/GlobalContext";
import { getPost } from "../../../api-calls/requests/getPost";
import { putVote } from "../../../api-calls/requests/putVote";
import CommentForm from "../components/CommentForm";
import "./posts.scss";
import updateCommentTree from "../updateCommentTree";
import VoteScoreWrapper from "../components/VoteScoreWrapper";

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
      text: null,
      op: null,
      score: null,
    },
    comments: [],
    vote: null,
  };

  submitVote = async (postId, value) => {
    const { userState } = this.context;

    try {
      const vote = await putVote(userState.token, value, postId, "post");

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
    const { setViewState, userState } = this.context;

    try {
      const { params } = this.props.match;
      const token = userState.isAuthenticated ? userState.token : null;
      const post = await getPost(parseInt(params.post), token);

      if (!window.location.pathname.includes(post.subreddit.name)) {
        window.location.replace(`/r/${post.subreddit.name}/${post.id}`);
      }

      this.setState({
        post: {
          id: post.id,
          title: post.title,
          text: post.text,
          op: post.author_profile.username,
          score: post.score,
        },
        vote: post.votes[0],
        comments: post.comments_field,
      });
      setViewState({ subreddit: post.subreddit.name });
    } catch (err) {
      console.log(err);
      window.location.replace("/");
    }
  };

  render() {
    const { comments, vote, post } = this.state;

    return (
      <div className="post-view">
        <div className="post">
          <VoteScoreWrapper
            submission={post}
            vote={vote}
            submitVote={this.submitVote}
          />
          <h3>{post.title}</h3>
          <p>
            <Interweave
              content={post.text}
              matchers={[new UrlMatcher("url")]}
            />
          </p>
          <p>{post.op}</p>
          <CommentForm
            submissionId={post.id}
            submissionType="post"
            addComment={this.addComment}
          />
        </div>
        <Comments
          comments={comments}
          createUpdateCommentVote={this.createUpdateCommentVote}
          addComment={this.addComment}
        />
      </div>
    );
  }
}
