import React, { Component, Fragment } from "react";
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
    if (posts.length > 0) {
      setViewState({ ...viewState, subreddit: posts[0].subreddit.name });
    } else {
      setViewState({
        ...viewState,
        subreddit: this.props.match.params.subreddit,
      });
    }
  };

  updateVote = (id, vote) => {
    this.setState((state) => {
      let newPosts = [...state.posts];

      for (let i = 0; i < newPosts.length; i++) {
        const post = newPosts[i];

        if (post.id === id) {
          post.score = vote.updated_value;
          post.vote = vote;
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
    return (
      <Fragment>
        {this.state.posts.length > 0 ? (
          <Posts posts={this.state.posts} updateVote={this.updateVote} />
        ) : (
          <div className="centered">
            This subreddit is empty, add some posts!
          </div>
        )}
      </Fragment>
    );
  }
}
