import axios from "axios";
import headerConfig from "../helpers/headerConfig";

export const getVotes = async (token) => {
  try {
    const response = await axios.get(`/api/vote/`, headerConfig(token));
    return response.data;
  } catch (err) {
    return err.errors;
  }
};
