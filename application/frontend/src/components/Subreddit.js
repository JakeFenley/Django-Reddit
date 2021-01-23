import React, { Component } from "react";
import { subredditPosts } from "../api-calls/requests/subredditPosts";
import Posts from "./posts/pages/Posts";
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
  };

  getPosts = async () => {
    const { viewState, setViewState } = this.context;

    const posts = await subredditPosts(this.props.match.params.subreddit);
    this.setState({ posts: posts });
    setViewState({ ...viewState, subreddit: posts[0].subreddit.name });
  };

  updateVote = (id, vote) => {
    this.setState((state) => {
      let newPosts = [...state.posts];

      for (let i = 0; i < newPosts.length; i++) {
        const post = newPosts[i];

        if (post.id === id) {
          post.score = vote.updated_value;
          post.votes = [vote];
          break;
        }
      }
      return {
        posts: newPosts,
      };
    });
  };

  componentDidMount() {
    this.getPosts();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.match.params.subreddit !== this.props.match.params.subreddit
    ) {
      this.getPosts();
    }
  }

  render() {
    return <Posts posts={this.state.posts} updateVote={this.updateVote} />;
  }
}
