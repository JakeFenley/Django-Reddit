import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import CommentForm from "./CommentForm";
import { GlobalContext } from "../../../context/GlobalContext";
import VoteButton from "./VoteButton";
import Interweave from "interweave";
import { UrlMatcher } from "interweave-autolink";
import { putVote } from "../../../api-calls/requests/putVote";

export default class Comments extends Component {
  static contextType = GlobalContext;
  static propTypes = {
    comments: PropTypes.array.isRequired,
    updateCommentVote: PropTypes.func.isRequired,
    updateComments: PropTypes.func.isRequired,
  };

  submitVote = async (e, direction, commentId) => {
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
      const vote = await putVote(userState.token, value, commentId, "comment");
      this.props.updateCommentVote(commentId, vote);
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
              <VoteButton
                postId={x.id}
                direction={"upvote"}
                componentType={"comment"}
                vote={x.votes[0]}
                post={x}
                submitVote={this.submitVote}
              />
              <div className="score" data-postid={x.id}>
                {x.score}
              </div>
              <VoteButton
                postId={x.id}
                direction={"downvote"}
                componentType={"comment"}
                post={x}
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
                updateComments={this.props.updateComments}
              />
            </div>
            <div className="test">
              <Comments
                comments={x.comments_field}
                updateCommentVote={this.props.updateCommentVote}
                updateComments={this.props.updateComments}
              />
            </div>
          </Fragment>
        ))}
      </div>
    );
  }
}
