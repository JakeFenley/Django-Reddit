import React, { Component } from "react";
import { Fragment } from "react";
import { Redirect } from "react-router";
import { postSubreddit } from "../api-calls/requests/postSubreddit";
import { GlobalContext } from "../context/GlobalContext";

export default class CreateSubreddit extends Component {
  static contextType = GlobalContext;

  state = {
    successRedirectURI: null,
  };

  regexValidator = new RegExp("^[a-zA-Z]*$");

  handleSubmit = async e => {
    const { viewState, setViewState, setAlertMessages } = this.context;
    e.preventDefault();
    const name = e.target.elements["name"].value;
    if (!this.regexValidator.test(name)) {
      setAlertMessages(["Subreddit Name Must Contain Letters only"]);
      return;
    }

    try {
      const response = await postSubreddit(name);
      setViewState({
        subreddits: [...viewState.subreddits, response],
      });
      setTimeout(() => {
        this.setState({ successRedirectURI: `/r/${response.name}/` });
      }, 1000);
    } catch (err) {
      setAlertMessages([...err.messages]);
    }
  };

  createSuccessRedirect = () => (
    <Redirect to={this.state.successRedirectURI}></Redirect>
  );

  render() {
    return (
      <Fragment>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="name">Subreddit Name</label>
          <input type="text" id="name" name="name" />
          <button type="submit" id="submit" value="submit" name="submit">
            Submit
          </button>
        </form>
        {this.state.successRedirectURI && this.createSuccessRedirect()}
      </Fragment>
    );
  }
}
