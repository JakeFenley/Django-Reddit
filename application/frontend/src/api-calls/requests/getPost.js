import axios from "axios";
import headerConfig from "../helpers/headerConfig";

export const getPost = async (postId, token) => {
  const header = token ? headerConfig(token) : headerConfig();

  try {
    const response = await axios.get(`/api/getPost/${postId}`, header);

    return response.data;
  } catch (err) {
    return err;
  }
};
