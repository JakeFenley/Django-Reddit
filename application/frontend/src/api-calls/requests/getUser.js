import axios from "axios";
import success from "../helpers/loginSuccess";
import error from "../helpers/loginError";
import headerConfig from "../helpers/headerConfig";

export const getUser = async () => {
  try {
    const response = await axios.get("/api/auth/user", headerConfig());
    return success(response);
  } catch (err) {
    console.log(err);
    return error(err);
  }
};
