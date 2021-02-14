import React, { Component } from "react";
import { postSubreddit } from "../api-calls/requests/postSubreddit";
import { GlobalContext } from "../context/GlobalContext";

export default class CreateSubreddit extends Component {
  static contextType = GlobalContext;

  handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.elements["name"].value;

    try {
      const response = await postSubreddit(name);
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="name">Subreddit Name</label>
        <input type="text" id="name" name="name" />
        <button type="submit" id="submit" value="submit" name="submit">
          Submit
        </button>
      </form>
    );
  }
}
