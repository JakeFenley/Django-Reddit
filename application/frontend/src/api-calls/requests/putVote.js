import axios from "axios";
import headerConfig from "../helpers/headerConfig";

export const putVote = async (token, value, post_id) => {
  const body = JSON.stringify({ value, post_id });
  try {
    const response = await axios.put(`/api/vote/`, body, headerConfig(token));
    return response.data;
  } catch (err) {
    return err.errors;
  }
};
