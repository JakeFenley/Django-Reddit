import axios from "axios";
import headerConfig from "../helpers/headerConfig";

export const putVote = async (token, value, post_id, submission_type) => {
  const body = JSON.stringify({ value, submission_type });
  try {
    const response = await axios.put(
      `/api/vote/?post_id=${post_id}`,
      body,
      headerConfig(token)
    );
    return response.data;
  } catch (err) {
    return err.errors;
  }
};
