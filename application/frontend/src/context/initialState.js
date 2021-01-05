export const initialState = {
  user: null,
  isAuthenticated: false,
  token: null,
  isLoading: true,
};

export const initialErrorState = [];

export const initialViewState = {
  subreddit: null,
  votes: null,
  posts: null,
};

export const loggedOutState = {
  user: null,
  isAuthenticated: false,
  token: null,
  isLoading: false,
};
