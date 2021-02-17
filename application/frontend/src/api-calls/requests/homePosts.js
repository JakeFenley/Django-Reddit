import axios from "axios";
import headerConfig from "../helpers/headerConfig";

export const homePosts = async () => {
  try {
    const headers = await headerConfig();
    let response = await axios.get("/api/r/home/", headers);
    return response.data;
  } catch (err) {
    return err.errors;
  }
};
