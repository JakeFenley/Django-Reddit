import React, { Component } from "react";
import PropTypes from "prop-types";
import "./posts.scss";
import { putVote } from "../../../api-calls/requests/putVote";
import { Link } from "react-router-dom";
import { GlobalContext } from "../../../context/GlobalContext";
import VoteScoreWrapper from "../components/VoteScoreWrapper";
import Interweave from "interweave";
import { UrlMatcher } from "interweave-autolink";
import PostTopRow from "../components/PostTopRow";

export default class Posts extends Component {
  static contextType = GlobalContext;
  static propTypes = {
    posts: PropTypes.array,
    updateVote: PropTypes.func,
  };

  submitVote = async (postId, value) => {
    try {
      const vote = await putVote(value, postId, "post");

      this.props.updateVote(postId, vote);
    } catch (err) {
      console.log(err);
    }
  };

  getPostLink = (x) => {
    return `/r/${x.subreddit.name}/${x.id}`;
  };

  render() {
    const { posts } = this.props;
    return (
      <section className="posts">
        {posts.map((post) => (
          <div key={post.id} className="post">
            <VoteScoreWrapper
              submission={post}
              vote={post.vote}
              submitVote={this.submitVote}
            />
            <div className="contents">
              <PostTopRow post={post} />
              <p className="title">
                <Interweave
                  content={post.title_sanitized}
                  matchers={[new UrlMatcher("url")]}
                />
              </p>
              <p>
                <Interweave
                  content={post.text_sanitized}
                  matchers={[new UrlMatcher("url")]}
                />
              </p>
              <Link to={this.getPostLink(post)} className="text-button">
                Comments
              </Link>
            </div>
          </div>
        ))}
      </section>
    );
  }
}
