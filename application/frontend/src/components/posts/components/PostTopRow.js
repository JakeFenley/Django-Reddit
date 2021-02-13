import React, { Component } from "react";
import { Link } from "react-router-dom";
import TimeAgo from "react-timeago";
import PropTypes from "prop-types";

export default class PostTopRow extends Component {
  static propTypes = {
    post: PropTypes.object.isRequired,
  };
  getSubredditLink = (x) => {
    return `/r/${x.subreddit.name}/`;
  };

  render() {
    const { post } = this.props;
    return (
      <div className="top-row">
        <Link to={this.getSubredditLink(post)} className="subreddit">
          r/{post.subreddit.name}
        </Link>
        <span className="dot">•</span>
        <span className="name">Posted by u/{post.author_profile.username}</span>
        <span className="dot">•</span>
        <span className="light">{post.author_profile.karma} Karma</span>
        <span className="dot">•</span>
        <span className="time-ago">
          <TimeAgo date={post.created_at} />
        </span>
      </div>
    );
  }
}
