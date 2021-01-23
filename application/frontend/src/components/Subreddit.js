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

  componentDidMount() {
    const { setViewState } = this.context;

    (async () => {
      const posts = await subredditPosts(this.props.match.params.subreddit);
      this.setState({ posts: posts });
      setViewState({ subreddit: posts[0].subreddit.name });
    })();
  }

  render() {
    return <Posts posts={this.state.posts} />;
  }
}
