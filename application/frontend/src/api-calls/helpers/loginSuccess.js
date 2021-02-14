export default function success(response, token = response.data.token) {
  const { username } = response.data.user ? response.data.user : response.data;
  localStorage.token = token ? token : localStorage.token;
  return {
    newUserState: {
      user: username,
      isAuthenticated: true,
      isLoading: false,
    },
    messages: [`Hello ${username}`],
  };
}
