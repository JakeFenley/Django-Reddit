import axios from "axios";
import headerConfig from "../helpers/headerConfig";

export const getPost = async (postId, token) => {
  const header = token ? headerConfig(token) : headerConfig();

  try {
    const response = await axios.get(`/api/getPost/?post_id=${postId}`, header);

    return response.data[0];
  } catch (err) {
    return err;
  }
};
