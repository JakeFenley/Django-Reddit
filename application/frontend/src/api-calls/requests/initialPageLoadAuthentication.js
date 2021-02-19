import axios from "axios";
import success from "../helpers/loginSuccess";
import error from "../helpers/loginError";
import getCSRF from "../helpers/getCSRF";

export const initialPageLoadAuthentication = async () => {
  let config = {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCSRF(),
    },
  };

  try {
    const response = await axios.post("/api/auth/token/refresh", config);
    return success(response);
  } catch (err) {
    return error(err);
  }
};
