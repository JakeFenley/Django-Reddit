import axios from "axios";
import headerConfig from "../helpers/headerConfig";

export const homePosts = async () => {
  try {
    const response = await axios.get("/api/r/home/", headerConfig());
    return response.data;
  } catch (err) {
    return err.errors;
  }
};
