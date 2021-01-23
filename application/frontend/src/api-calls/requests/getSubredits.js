import axios from "axios";
import headerConfig from "../helpers/headerConfig";

export const getSubreddits = async () => {
  try {
    const response = await axios.get("/api/subreddit/", headerConfig());
    return response.data;
  } catch (err) {
    return err.errors;
  }
};
