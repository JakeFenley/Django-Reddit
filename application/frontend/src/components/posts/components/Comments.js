import React, { Component } from "react";
import PropTypes from "prop-types";
import { GlobalContext } from "../../../context/GlobalContext";
import { putVote } from "../../../api-calls/requests/putVote";
import Comment from "./Comment";
export default class Comments extends Component {
  static contextType = GlobalContext;
  static propTypes = {
    comments: PropTypes.any,
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
        {Array.isArray(comments)
          ? comments.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                addComment={this.props.addComment}
                createUpdateCommentVote={this.props.createUpdateCommentVote}
                submitVote={this.submitVote}
              />
            ))
          : null}
      </div>
    );
  }
}
