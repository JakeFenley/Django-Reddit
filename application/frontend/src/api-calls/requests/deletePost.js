import axios from "axios";
import headerConfig from "../helpers/headerConfig";

export const deletePost = async (post) => {
  try {
    const response = await axios.delete(
      `/api/post/${post}`,
      null,
      headerConfig()
    );
    return response.data;
  } catch (err) {
    return err.errors;
  }
};
