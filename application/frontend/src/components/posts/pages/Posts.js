import React, { Component } from "react";
import PropTypes from "prop-types";
import "./posts.scss";
import { putVote } from "../../../api-calls/requests/putVote";
import { Link } from "react-router-dom";
import { GlobalContext } from "../../../context/GlobalContext";
import VoteScoreWrapper from "../components/VoteScoreWrapper";
import TimeAgo from "react-timeago";
import Interweave from "interweave";
import { UrlMatcher } from "interweave-autolink";

export default class Posts extends Component {
  static contextType = GlobalContext;
  static propTypes = {
    posts: PropTypes.array,
    updateVote: PropTypes.func,
  };

  submitVote = async (postId, value) => {
    const { userState } = this.context;

    try {
      const vote = await putVote(userState.token, value, postId, "post");

      this.props.updateVote(postId, vote);
    } catch (err) {
      console.log(err);
    }
  };

  getPostLink = (x) => {
    return `/r/${x.subreddit.name}/${x.id}`;
  };

  getSubredditLink = (x) => {
    return `/r/${x.subreddit.name}/`;
  };

  render() {
    return (
      <section className="posts">
        {this.props.posts.map((x) => (
          <div key={x.id} className="post">
            <VoteScoreWrapper
              submission={x}
              vote={x.vote}
              submitVote={this.submitVote}
            />
            <div className="contents">
              <div className="top-row">
                <Link to={this.getSubredditLink(x)} className="subreddit">
                  r/{x.subreddit.name}
                </Link>
                <span className="dot">•</span>
                <span className="name">
                  Posted by u/{x.author_profile.username}
                </span>
                <span className="dot">•</span>
                <span className="light">{x.author_profile.karma} Karma</span>
                <span className="dot">•</span>
                <span className="time-ago">
                  <TimeAgo date={x.created_at} />
                </span>
              </div>
              <h3>
                <Interweave
                  content={x.title_sanitized}
                  matchers={[new UrlMatcher("url")]}
                />
              </h3>
              <p>
                <Interweave
                  content={x.text_sanitized}
                  matchers={[new UrlMatcher("url")]}
                />
              </p>
              <Link to={this.getPostLink(x)}>Comments</Link>
            </div>
          </div>
        ))}
      </section>
    );
  }
}
