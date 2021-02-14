import axios from "axios";
import headerConfig from "../helpers/headerConfig";

export const postSubreddit = async (name) => {
  const body = JSON.stringify({ name });

  try {
    const response = await axios.post(`/api/subreddit/`, body, headerConfig());
    return response.data;
  } catch (err) {
    return err.errors;
  }
};
