import React, { Component } from "react";
import { homePosts } from "../api-calls/requests/homePosts";
import Posts from "./posts/pages/Posts";
import { GlobalContext } from "../context/GlobalContext";

export default class Home extends Component {
  static contextType = GlobalContext;
  state = {
    posts: [],
    userState: this.context.userState,
  };

  async consumePosts() {
    const { setViewState, userState } = this.context;

    const token = userState.isAuthenticated ? userState.token : null;
    const posts = await homePosts(token);

    this.setState({
      posts: posts,
      userState: this.context.userState,
    });
    setViewState({ subreddit: "Home" });
  }

  updateVote(id, vote) {
    this.setState((state) => {
      let newPosts = [...state.posts];

      for (let i = 0; i < newPosts.length; i++) {
        const post = newPosts[i];

        if (post.id === id) {
          post.score = vote.updated_value;
          post.votes[0].value = vote.value;
          break;
        }
      }
      return {
        posts: newPosts,
      };
    });
  }

  componentDidMount() {
    this.consumePosts();
  }

  componentDidUpdate() {
    if (this.context.userState !== this.state.userState) {
      this.consumePosts();
    }
  }

  render() {
    return (
      <Posts
        posts={this.state.posts}
        updateVote={(id, vote) => {
          this.updateVote(id, vote);
        }}
      />
    );
  }
}
