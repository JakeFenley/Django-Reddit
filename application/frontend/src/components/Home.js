import React, { Component } from "react";
import { getVotes } from "../api-calls/requests/getVotes";
import { homePosts } from "../api-calls/requests/homePosts";
import Posts from "./posts/Posts";
import { GlobalContext } from "../context/GlobalContext";

export default class Home extends Component {
  static contextType = GlobalContext;
  state = {
    posts: [],
    votes: [],
  };

  updateVotes(votes) {
    this.setState({ votes: votes });
  }

  componentDidMount() {
    const { setViewState } = this.context;
    let votes = null;

    (async () => {
      const posts = await homePosts();
      if (localStorage.token) {
        votes = await getVotes(localStorage.token);
      }

      this.setState({ posts: posts, votes: votes });
      setViewState({ subreddit: "Home" });
    })();
  }

  render() {
    return (
      <Posts
        posts={this.state.posts}
        votes={this.state.votes}
        updateVotes={this.updateVotes.bind(this)}
      />
    );
  }
}
