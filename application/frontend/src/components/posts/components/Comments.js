import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import CommentForm from "./CommentForm";
import { GlobalContext } from "../../../context/GlobalContext";
import VoteButton from "./VoteButton";
import Interweave from "interweave";
import { UrlMatcher } from "interweave-autolink";

export default class Comments extends Component {
  static contextType = GlobalContext;
  static propTypes = {
    comments: PropTypes.array.isRequired,
  };

  state = {
    commentFormOpen: false,
  };

  async submitVote(e, direction, postId) {
    const { userState } = this.context;
    let value;

    if (e.target.dataset.selected === "true") {
      value = 0;
    } else if (direction === "upvote") {
      e.target.dataset.selected = "false";
      value = 1;
    } else {
      e.target.dataset.selected = "false";
      value = -1;
    }

    try {
      // const vote = await putVote(userState.token, value, postId, "post");
      // this.props.updateVote(postId, vote);
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const { comments } = this.props;
    const { commentFormOpen } = this.state;
    const { userState } = this.context;
    return (
      <div className="comments">
        {comments.map((x) => (
          <Fragment key={x.id}>
            <div className="comment">
              <VoteButton
                postId={x.id}
                direction={"upvote"}
                componentType={"comment"}
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
                componentType={"comment"}
                post={x}
                vote={x.votes[0]}
                submitVote={this.submitVote}
              />
              <h3>{x.title}</h3>
              <p>
                <Interweave
                  content={x.text}
                  matchers={[new UrlMatcher("url")]}
                />
              </p>
              <p>{x.author_profile.username}</p>

              {userState.isAuthenticated ? (
                <button
                  onClick={() => {
                    this.toggleCommentForm();
                  }}
                >
                  Reply
                </button>
              ) : null}

              {commentFormOpen ? (
                <CommentForm submissionId={x.id} submissionType="comment" />
              ) : null}
            </div>
            <div className="test">
              <Comments comments={x.comments_field} />
            </div>
          </Fragment>
        ))}
      </div>
    );
  }
}
