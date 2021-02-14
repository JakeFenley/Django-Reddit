import axios from "axios";
import headerConfig from "../helpers/headerConfig";

export const getPost = async (postId) => {
  try {
    const response = await axios.get(`/api/getPost/${postId}`, headerConfig());

    return response.data;
  } catch (err) {
    return err;
  }
};
