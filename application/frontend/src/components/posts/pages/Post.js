import { UrlMatcher } from "interweave-autolink";
import Interweave from "interweave";
import React, { Component } from "react";
import Comments from "../components/Comments";
import PropTypes from "prop-types";
import { GlobalContext } from "../../../context/GlobalContext";
import { getPost } from "../../../api-calls/requests/getPost";
import { putVote } from "../../../api-calls/requests/putVote";
import VoteButton from "../components/VoteButton";
import CommentForm from "../components/CommentForm";
import "./posts.scss";

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
      post_id: null,
      title: null,
      text: null,
      op: null,
      score: null,
    },
    comments: [],
    vote: null,
    commentFormOpen: false,
  };

  async submitVote(e, direction, postId) {
    const { userState } = this.context;
    let value;

    if (e.target.dataset.selected === "true") {
      value = 0;
    } else if (direction === "upvote") {
      e.target.dataset.selected = "false";
      value = 1;
    } else {
      e.target.dataset.selected = "false";
      value = -1;
    }

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
  }

  async consumePost() {
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
          post_id: post.id,
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
  }

  toggleCommentForm() {
    if (this.state.commentFormOpen) {
      this.setState({ commentFormOpen: false });
    } else if (this.context.userState.isAuthenticated) {
      this.setState({ commentFormOpen: true });
    }
  }

  componentDidMount() {
    this.consumePost();
  }

  loadingElement() {
    return <div className="loading">Loading....</div>;
  }

  render() {
    const { comments, vote, commentFormOpen, post } = this.state;
    const { userState } = this.context;
    return (
      <div className="post-view">
        <div className="post">
          <VoteButton
            postId={post.post_id}
            direction={"upvote"}
            componentType={"post"}
            vote={vote}
            post={post}
            submitVote={this.submitVote.bind(this)}
          />
          <div className="score" data-postid={post.post_id}>
            {post.score}
          </div>
          <VoteButton
            postId={post.post_id}
            direction={"downvote"}
            componentType={"post"}
            post={post}
            vote={vote}
            submitVote={this.submitVote.bind(this)}
          />
          <h3>{post.title}</h3>
          <p>
            <Interweave
              content={post.text}
              matchers={[new UrlMatcher("url")]}
            />
          </p>
          <p>{post.op}</p>
          {userState.isAuthenticated ? (
            <button
              onClick={() => {
                this.toggleCommentForm();
              }}
            >
              Reply
            </button>
          ) : null}
        </div>
        {commentFormOpen ? (
          <CommentForm submissionId={post.post_id} submissionType="post" />
        ) : null}
        <Comments comments={comments} vote={vote} />
      </div>
    );
  }
}
