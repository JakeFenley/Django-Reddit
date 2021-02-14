export const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

export const initialErrorState = [];

export const initialViewState = {
  subreddit: null,
  subreddits: [],
  isLoading: true,
};

export const loggedOutState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
};
