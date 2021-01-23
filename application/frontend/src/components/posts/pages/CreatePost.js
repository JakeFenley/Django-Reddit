import React, { useContext, useState } from "react";
import { Redirect } from "react-router";
import { createPost } from "../../../api-calls/requests/createPost";

import { GlobalContext } from "../../../context/GlobalContext";

export default function CreatePost() {
  const { userState, viewState } = useContext(GlobalContext);
  const [postId, setPostId] = useState(null);

  if (!userState.user && !userState.isLoading) {
    return <Redirect to="/" />;
  }

  if (postId !== null) {
    const postUrl = `/r/${viewState.subreddit}/${postId}`;
    return <Redirect to={postUrl} />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const title = e.target.elements["title"].value;
    const text = e.target.elements["text"].value;
    const response = await createPost(
      userState.token,
      title,
      text,
      1,
      "AmItheBadGuy"
    );

    if (response) {
      setPostId(response.id);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title">Title</label>
      <input type="text" id="title" name="title" />
      <label htmlFor="text">Text</label>
      <textarea type="text" id="text" name="text" />
      <button type="submit" id="submit" value="submit" name="submit">
        Submit
      </button>
    </form>
  );
}
