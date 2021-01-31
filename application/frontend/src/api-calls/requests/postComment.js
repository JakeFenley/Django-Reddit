import axios from "axios";
import headerConfig from "../helpers/headerConfig";

export const postComment = async (token, id, type, text) => {
  const body = JSON.stringify({ text });
  let param;

  if (type === "post") {
    param = `?post_id=${id}`;
  } else if (type === "comment") {
    param = `?comment_id=${id}`;
  }

  try {
    const response = await axios.post(
      `/api/comment/${param}`,
      body,
      headerConfig(token)
    );
    console.log(response.data);
    return response.data;
  } catch (err) {
    return err.errors;
  }
};
