import React, { Component } from "react";
import VoteButton from "./VoteButton";
import PropTypes from "prop-types";

export default class VoteScoreWrapper extends Component {
  static propTypes = {
    submission: PropTypes.object.isRequired,
    submitVote: PropTypes.func.isRequired,
    vote: PropTypes.object,
  };

  render() {
    const { submission, vote, submitVote } = this.props;
    return (
      <div>
        <VoteButton
          submissionId={submission.id}
          direction={"upvote"}
          vote={vote}
          submission={submission}
          submitVote={submitVote}
        />
        <div className="score" data-submissionid={submission.id}>
          {submission.score}
        </div>
        <VoteButton
          submissionId={submission.id}
          direction={"downvote"}
          submission={submission}
          vote={vote}
          submitVote={submitVote}
        />
      </div>
    );
  }
}
