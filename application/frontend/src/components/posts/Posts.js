import React, { Component } from "react";
import PropTypes from "prop-types";
import "./posts.scss";
import UpArrow from "./up-arrow";
import DownArrow from "./down-arrow";
import { putVote } from "../../api-calls/requests/putVote";

export default class Posts extends Component {
  static propTypes = {
    posts: PropTypes.array,
    votes: PropTypes.array,
    updateVotes: PropTypes.func,
  };

  submitVote = (e) => {
    const post_id = parseInt(e.target.dataset.postid);
    let value;

    if (e.target.dataset.selected === "true") {
      value = 0;
    } else if (e.target.classList.contains("upvote")) {
      e.target.dataset.selected = "false";
      value = 1;
    } else {
      e.target.dataset.selected = "false";
      value = -1;
    }

    (async () => {
      const vote = await putVote(localStorage.token, value, post_id);
      let keyExists = false;
      const newVotes = this.props.votes.map((x) => {
        if (x.post_id === vote.post_id) {
          keyExists = true;
          x.value = vote.value;
          x.updated_value = vote.updated_value;
          return x;
        } else {
          x.updated_value = null;
          return x;
        }
      });
      if (!keyExists) {
        newVotes.push({
          value: vote.value,
          post_id: vote.post_id,
          updated_value: vote.updated_value,
        });
      }
      this.props.updateVotes(newVotes);
    })();
  };

  _addButtonAttrs(button) {
    button.dataset.selected = "true";
    button.classList.add("selected");
  }

  _removeButtonAttrs(button) {
    button.dataset.selected = "false";
    button.classList.remove("selected");
  }

  componentDidUpdate(prevProps) {
    if (this.props.votes !== prevProps.votes && this.props.votes) {
      this.props.votes.forEach((x) => {
        const buttons = document.querySelectorAll(
          `button[data-postid="${x.post_id}"]`
        );
        if (x.updated_value || x.updated_value === 0) {
          const score = document.querySelector(
            `.score[data-postid="${x.post_id}"]`
          );
          score.innerText = x.updated_value;
        }

        if (x.value === 1) {
          this._addButtonAttrs(buttons[0]);
          this._removeButtonAttrs(buttons[1]);
        } else if (x.value === -1) {
          this._addButtonAttrs(buttons[1]);
          this._removeButtonAttrs(buttons[0]);
        } else {
          this._removeButtonAttrs(buttons[0]);
          this._removeButtonAttrs(buttons[1]);
        }
      });
    }
  }

  render() {
    return (
      <section className="posts">
        {this.props.posts.map((x) => (
          <div key={x.id} className="post">
            <button
              className="upvote"
              data-postid={x.id}
              data-selected="false"
              onClick={this.submitVote}
            >
              <UpArrow />
            </button>
            <div className="score" data-postid={x.id}>
              {x.score}
            </div>
            <button
              className="downvote"
              data-postid={x.id}
              data-selected="false"
              onClick={this.submitVote}
            >
              <DownArrow />
            </button>
            <h3>{x.title}</h3>
            <p>{x.text}</p>
          </div>
        ))}
      </section>
    );
  }
}
