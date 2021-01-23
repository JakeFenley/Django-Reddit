import React, { Component, Fragment } from "react";
import { GlobalContext } from "../../../context/GlobalContext";
import PropTypes from "prop-types";
import { postComment } from "../../../api-calls/requests/postComment";

export default class CommentForm extends Component {
  static contextType = GlobalContext;
  static propTypes = {
    submissionType: PropTypes.string.isRequired,
    submissionId: PropTypes.number,
    addComment: PropTypes.func.isRequired,
  };

  state = {
    submitFailure: false,
    commentFormOpen: false,
  };

  handleSubmit = async (e) => {
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
      this.props.addComment(submissionId, submissionType, comment);
      this.toggleCommentForm();
    } else {
      this.setState({ submitFailure: true });
    }
  };

  placeholderText() {
    if (this.state.submitFailure) {
      return "Invalid Comment, Minimum 1 character";
    } else {
      return "Enter Comment";
    }
  }

  toggleCommentForm = () => {
    if (this.state.commentFormOpen) {
      this.setState({ commentFormOpen: false });
    } else if (this.context.userState.isAuthenticated) {
      this.setState({ commentFormOpen: true });
    }
  };

  form = () => {
    return (
      <form onSubmit={this.handleSubmit}>
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
  };

  render() {
    return (
      <Fragment>
        {this.context.userState.isAuthenticated ? (
          <button onClick={this.toggleCommentForm}>Reply</button>
        ) : null}
        {this.state.commentFormOpen ? this.form() : null}
      </Fragment>
    );
  }
}
