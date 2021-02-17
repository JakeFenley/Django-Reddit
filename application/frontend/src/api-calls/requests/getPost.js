import axios from "axios";
import headerConfig from "../helpers/headerConfig";

export const getPost = async (postId) => {
  try {
    const headers = await headerConfig();
    const response = await axios.get(`/api/getPost/${postId}`, headers);
    return response.data;
  } catch (err) {
    return err;
  }
};
