import React, { Component } from "react";
import { GlobalContext } from "../../../context/GlobalContext";
import PropTypes from "prop-types";
import { postComment } from "../../../api-calls/requests/postComment";

export default class CommentForm extends Component {
  static contextType = GlobalContext;
  static propTypes = {
    postId: PropTypes.number.isRequired,
    submissionType: PropTypes.string.isRequired,
    submissionId: PropTypes.number.isRequired,
  };

  state = {
    submitFailure: false,
  };

  async handleSubmit(e) {
    e.preventDefault();
    const { submissionId, submissionType } = this.props;
    const { userState } = this.context;
    const text = e.target.elements["comment"].value;

    if (text.length > 0) {
      const comment = await postComment(
        userState.token,
        submissionId,
        submissionType,
        text
      );
      console.log(comment);
    } else {
      this.setState({ submitFailure: true });
    }
  }

  placeholderText() {
    if (this.state.submitFailure) {
      return "Invalid Comment, Minimum 1 character";
    } else {
      return "Enter Comment";
    }
  }

  render() {
    return (
      <form
        onSubmit={(e) => {
          this.handleSubmit(e);
        }}
      >
        <label htmlFor="comment"></label>
        <textarea
          placeholder={this.placeholderText()}
          id="comment"
          name="comment"
        ></textarea>
        <button type="submit" id="submit" name="submit">
          Submit
        </button>
      </form>
    );
  }
}
