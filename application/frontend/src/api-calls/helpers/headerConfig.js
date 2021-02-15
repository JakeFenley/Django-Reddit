import getCSRF from "./getCSRF";

const headerConfig = () => {
  let config = {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCSRF(),
    },
  };

  if (localStorage.token) {
    config.headers.Authorization = "Token " + localStorage.token;
  }

  return config;
};

export default headerConfig;
