export default function success(response, token = response.data.access) {
  localStorage.token = token ? token : localStorage.token;
  localStorage.tokenCreatedAt = new Date();
  localStorage.user = response.data.user
    ? response.data.user
    : localStorage.user;

  return {
    newUserState: {
      user: localStorage.user,
      isAuthenticated: true,
      isLoading: false,
    },
    messages: [`Hello ${localStorage.user}`],
  };
}
