import React, { Component } from "react";
import PropTypes from "prop-types";
import "./posts.scss";
import { putVote } from "../../../api-calls/requests/putVote";
import { Link } from "react-router-dom";
import VoteButton from "../components/VoteButton";
import { GlobalContext } from "../../../context/GlobalContext";

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

  render() {
    return (
      <section className="posts">
        {this.props.posts.map((x) => (
          <div key={x.id} className="post">
            <VoteButton
              postId={x.id}
              direction={"upvote"}
              componentType={"post"}
              vote={x.votes[0]}
              post={x}
              submitVote={this.submitVote}
            />
            <div className="score" data-postid={x.id}>
              {x.score}
            </div>
            <VoteButton
              postId={x.id}
              direction={"downvote"}
              componentType={"post"}
              post={x}
              vote={x.votes[0]}
              submitVote={this.submitVote}
            />
            <h3>{x.title}</h3>
            <p>{x.text}</p>
            <Link to={this.getPostLink(x)}>See Post</Link>
          </div>
        ))}
      </section>
    );
  }
}
