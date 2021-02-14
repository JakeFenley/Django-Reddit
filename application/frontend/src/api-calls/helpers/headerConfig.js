const headerConfig = () => {
  let config = {
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": localStorage.csrf,
    },
  };

  if (localStorage.token) {
    config.headers.Authorization = "Token " + localStorage.token;
  }

  return config;
};

export default headerConfig;
