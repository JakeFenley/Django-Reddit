import React, { Component } from "react";
import DownArrow from "./down-arrow";
import UpArrow from "./up-arrow";
import PropTypes from "prop-types";
import { GlobalContext } from "../../../context/GlobalContext";

export default class VoteButton extends Component {
  static contextType = GlobalContext;
  static propTypes = {
    submitVote: PropTypes.func.isRequired,
    vote: PropTypes.object,
    post: PropTypes.object,
    submissionId: PropTypes.number,
    direction: PropTypes.string.isRequired,
  };

  state = {
    className: "vote-button",
    dataSelected: "false",
  };

  updateState() {
    const { vote, direction } = this.props;
    let className;
    let dataSelected;

    if (vote.value === 1 && direction === "upvote") {
      className = "upvote vote-button selected";
      dataSelected = true;
    } else if (vote.value === -1 && direction === "downvote") {
      className = "downvote vote-button selected";
      dataSelected = true;
    } else {
      className = `${direction} vote-button`;
      dataSelected = false;
    }
    this.setState({ className: className, dataSelected: dataSelected });
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props && this.props.vote) {
      this.updateState();
      return;
    }
  }

  getButtonValue = (e) => {
    if (e.target.dataset.selected === "true") {
      return 0;
    } else if (this.props.direction === "upvote") {
      e.target.dataset.selected = "false";
      return 1;
    } else {
      e.target.dataset.selected = "false";
      return -1;
    }
  };

  handleVoteClick = (e) => {
    const { userState, setAlertMessages } = this.context;
    const { submitVote, submissionId } = this.props;

    const value = this.getButtonValue(e);

    if (userState.isAuthenticated) {
      submitVote(submissionId, value);
    } else {
      setAlertMessages(["To vote on a submission please log in"]);
    }
  };

  render() {
    return (
      <button
        className={this.state.className}
        data-selected={this.state.dataSelected}
        onClick={this.handleVoteClick}
      >
        {this.props.direction === "upvote" ? UpArrow() : DownArrow()}
      </button>
    );
  }
}
