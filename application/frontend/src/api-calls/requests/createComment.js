import axios from "axios";
import headerConfig from "../helpers/headerConfig";

export const createPost = async (
  token,
  title,
  text,
  subreddit,
  subreddit_name
) => {
  const body = JSON.stringify({ title, text, subreddit, subreddit_name });
  try {
    const response = await axios.post(`/api/post/`, body, headerConfig(token));
    return response.data;
  } catch (err) {
    return err.errors;
  }
};
