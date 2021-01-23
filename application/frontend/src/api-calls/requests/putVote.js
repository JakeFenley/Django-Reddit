import axios from "axios";
import headerConfig from "../helpers/headerConfig";

export const putVote = async (token, value, id, submission_type) => {
  const body = JSON.stringify({ value, submission_type });

  let param;

  if (submission_type === "post") {
    param = `?post_id=${id}`;
  } else if (submission_type === "comment") {
    param = `?comment_id=${id}`;
  }

  try {
    const response = await axios.put(
      `/api/vote/${param}`,
      body,
      headerConfig(token)
    );
    return response.data;
  } catch (err) {
    return err.errors;
  }
};
