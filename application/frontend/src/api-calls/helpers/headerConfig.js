import { getNewAccessToken } from "../requests/getNewAccessToken";
import getCSRF from "./getCSRF";

const TOKEN_EXPIRY_TIME = 1000 * 60 * 4;

const headerConfig = async () => {
  let config = {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCSRF(),
    },
  };

  if (localStorage.token) {
    const tokenExpired =
      new Date() - Date.parse(localStorage.tokenCreatedAt) > TOKEN_EXPIRY_TIME
        ? true
        : false;

    if (tokenExpired) {
      const newToken = await getNewAccessToken();
      config.headers.Authorization = "Token " + newToken;
      localStorage.token = newToken;
      localStorage.tokenCreatedAt = new Date();
      return config;
    } else {
      config.headers.Authorization = "Token " + localStorage.token;
      return config;
    }
  } else {
    return config;
  }
};

export default headerConfig;
