export default function success(response, token = response.data.access) {
  localStorage.token = token ? token : localStorage.token;
  localStorage.tokenCreatedAt = new Date();
  const user = response.data.user;
  return {
    newUserState: {
      user: user,
      isAuthenticated: true,
      isLoading: false,
    },
    messages: [`Hello ${user}`],
  };
}
