import axios from "axios";
import headerConfig from "../helpers/headerConfig";

export const subredditPosts = async (subreddit) => {
  try {
    const response = await axios.get(
      `/api/subreddit/?subreddit=${subreddit}`,
      headerConfig()
    );
    return response.data;
  } catch (err) {
    return err.errors;
  }
};
