import axios from "axios";
import headerConfig from "../helpers/headerConfig";

export const getSubreddits = async () => {
  try {
    const headers = await headerConfig();
    const response = await axios.get("/api/subreddit/", headers);
    return response.data;
  } catch (err) {
    return err.errors;
  }
};
