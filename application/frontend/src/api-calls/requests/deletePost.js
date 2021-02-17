import axios from "axios";
import headerConfig from "../helpers/headerConfig";

export const deletePost = async (post) => {
  try {
    const headers = await headerConfig();
    const response = await axios.delete(`/api/post/${post}/`, headers);
    return response.data;
  } catch (err) {
    return err.errors;
  }
};
