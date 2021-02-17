import axios from "axios";
import getCSRF from "../helpers/getCSRF";

export const getNewAccessToken = async () => {
  let config = {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCSRF(),
    },
  };

  try {
    const response = await axios.post("/api/auth/token/refresh", config);
    return response.data.access;
  } catch (err) {
    return err;
  }
};
