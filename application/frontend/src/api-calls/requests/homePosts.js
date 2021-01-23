import axios from "axios";
import headerConfig from "../helpers/headerConfig";

export const homePosts = async (token) => {
  const header = token ? headerConfig(token) : headerConfig();
  try {
    const response = await axios.get("/api/r/home/", header);
    return response.data;
  } catch (err) {
    return err.errors;
  }
};
