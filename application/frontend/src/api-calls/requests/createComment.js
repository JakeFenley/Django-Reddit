import axios from "axios";
import headerConfig from "../helpers/headerConfig";

export const createPost = async (title, text, subreddit, subreddit_name) => {
  const body = JSON.stringify({ title, text, subreddit, subreddit_name });
  try {
    const headers = await headerConfig();
    const response = await axios.post(`/api/post/`, body, headers);
    return response.data;
  } catch (err) {
    return err.errors;
  }
};
