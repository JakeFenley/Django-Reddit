import React, { Component } from "react";
import { subredditPosts } from "../api-calls/requests/subredditPosts";
import { getVotes } from "../api-calls/requests/getVotes";
import Posts from "./posts/Posts";
import PropTypes from "prop-types";
import { GlobalContext } from "../context/GlobalContext";

export default class Subreddit extends Component {
  static contextType = GlobalContext;
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        subreddit: PropTypes.string.isRequired,
      }),
    }),
  };

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
      const posts = await subredditPosts(this.props.match.params.subreddit);
      if (localStorage.token) {
        votes = await getVotes(localStorage.token);
      }
      this.setState({ posts: posts, votes: votes });
      setViewState({ subreddit: posts[0].subreddit.name });
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
