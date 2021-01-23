import React, { Component, Fragment } from "react";
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
    postId: PropTypes.number,
    componentType: PropTypes.string.isRequired,
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

  createButton() {
    const { submitVote, direction, postId } = this.props;

    return (
      <button
        className={this.state.className}
        data-selected={this.state.dataSelected}
        onClick={(e) => {
          submitVote(e, direction, postId);
        }}
      >
        {direction === "upvote" ? UpArrow() : DownArrow()}
      </button>
    );
  }

  render() {
    return (
      <Fragment>
        {this.context.userState.isAuthenticated ? this.createButton() : null}
      </Fragment>
    );
  }
}
