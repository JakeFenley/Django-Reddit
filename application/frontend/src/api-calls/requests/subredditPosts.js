import axios from "axios";
import headerConfig from "../helpers/headerConfig";

export const subredditPosts = async (subreddit) => {
  try {
    const headers = await headerConfig();
    const response = await axios.get(
      `/api/getSubredditPosts/?subreddit=${subreddit}`,
      headers
    );
    return response.data;
  } catch (err) {
    return err.errors;
  }
};
