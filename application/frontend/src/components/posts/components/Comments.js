import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import CommentForm from "./CommentForm";
import { GlobalContext } from "../../../context/GlobalContext";
import Interweave from "interweave";
import { UrlMatcher } from "interweave-autolink";
import { putVote } from "../../../api-calls/requests/putVote";
import VoteScoreWrapper from "./VoteScoreWrapper";

export default class Comments extends Component {
  static contextType = GlobalContext;
  static propTypes = {
    comments: PropTypes.array.isRequired,
    createUpdateCommentVote: PropTypes.func.isRequired,
    addComment: PropTypes.func.isRequired,
  };

  submitVote = async (commentId, value) => {
    const { userState } = this.context;

    try {
      const vote = await putVote(userState.token, value, commentId, "comment");
      this.props.createUpdateCommentVote(commentId, vote);
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const { comments } = this.props;
    return (
      <div className="comments">
        {comments.map((x) => (
          <Fragment key={x.id}>
            <div className="comment">
              <VoteScoreWrapper
                submission={x}
                vote={x.votes[0]}
                submitVote={this.submitVote}
              />
              <h3>{x.title}</h3>
              <p>
                <Interweave
                  content={x.text}
                  matchers={[new UrlMatcher("url")]}
                />
              </p>
              <p>{x.author_profile.username}</p>
              <CommentForm
                submissionId={x.id}
                submissionType="comment"
                addComment={this.props.addComment}
              />
            </div>
            <div className="test">
              <Comments
                comments={x.comments_field}
                createUpdateCommentVote={this.props.createUpdateCommentVote}
                addComment={this.props.addComment}
              />
            </div>
          </Fragment>
        ))}
      </div>
    );
  }
}
