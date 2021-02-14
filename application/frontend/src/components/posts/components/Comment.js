import Interweave from "interweave";
import React, { Component, Fragment } from "react";
import CommentForm from "./CommentForm";
import VoteScoreWrapper from "./VoteScoreWrapper";
import PropTypes from "prop-types";
import { UrlMatcher } from "interweave-autolink";
import Comments from "./Comments";
import { GlobalContext } from "../../../context/GlobalContext";

export default class Comment extends Component {
  static propTypes = {
    comment: PropTypes.object.isRequired,
    createUpdateCommentVote: PropTypes.func.isRequired,
    addComment: PropTypes.func.isRequired,
    submitVote: PropTypes.func.isRequired,
  };

  static contextType = GlobalContext;

  state = {
    commentFormOpen: false,
  };

  toggleCommentForm = () => {
    if (this.state.commentFormOpen) {
      this.setState({ commentFormOpen: false });
    } else if (this.context.userState.isAuthenticated) {
      this.setState({ commentFormOpen: true });
    }
  };

  render() {
    const { comment } = this.props;
    return (
      <Fragment key={comment.id}>
        <div className="comment">
          <VoteScoreWrapper
            submission={comment}
            vote={comment.vote}
            submitVote={this.props.submitVote}
          />
          <div className="contents">
            <h3>{comment.title}</h3>
            <p>
              <Interweave
                content={comment.text_sanitized}
                matchers={[new UrlMatcher("url")]}
              />
            </p>
            <p>{comment.author_profile.username}</p>
            <div className="bottom-row">
              <button onClick={this.toggleCommentForm} className="text-button">
                Reply
              </button>
            </div>
          </div>
        </div>
        <CommentForm
          submissionId={comment.id}
          submissionType="comment"
          addComment={this.props.addComment}
          isOpen={this.state.commentFormOpen}
          toggleCommentForm={this.toggleCommentForm}
        />
        <div className="test">
          <Comments
            comments={comment.comments_field}
            createUpdateCommentVote={this.props.createUpdateCommentVote}
            addComment={this.props.addComment}
          />
        </div>
      </Fragment>
    );
  }
}
