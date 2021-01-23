import React, { Fragment, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalContext";
import { logout } from "../../api-calls/requests/logout";
import { loggedOutState } from "../../context/initialState";

export default function Header() {
  const { userState, setUserState, setAlertMessages, viewState } = useContext(
    GlobalContext
  );
  const [redditsNavOpen, setRedditsNavOpen] = useState(false);

  async function handleLogout(userState) {
    const response = await logout(userState.token);
    if (response.success) {
      localStorage.removeItem("token");

      setUserState(loggedOutState);
    }

    setAlertMessages(response.messages);
  }

  const userLoggedIn = (
    <Fragment>
      <li>
        <Link to="/createSubreddit">Create Subreddit</Link>
      </li>
      <li>
        <Link to="/createpost">Create Post</Link>
      </li>
      <li>
        <button
          onClick={() => {
            handleLogout(userState);
          }}
        >
          Logout
        </button>
      </li>
    </Fragment>
  );

  const userLoggedOut = (
    <Fragment>
      <li>
        <Link to="/login">Login</Link>
      </li>
      <li>
        <Link to="/register">Register</Link>
      </li>
    </Fragment>
  );

  const toggleRedditsNav = () => {
    if (redditsNavOpen) {
      setRedditsNavOpen(false);
    } else {
      setRedditsNavOpen(true);
    }
  };

  return (
    <header>
      <nav className="main">
        <button onClick={toggleRedditsNav}>
          {viewState.subreddit ? viewState.subreddit : "Home"}
        </button>
        <ul>
          <li className="user-name">
            {userState.user ? `Logged in as: ${userState.user}` : ""}
          </li>
          {userState.user ? userLoggedIn : userLoggedOut}
        </ul>
      </nav>
      <nav className={redditsNavOpen ? "reddits open" : "reddits"}>
        <Link to="/" onClick={toggleRedditsNav}>
          Home
        </Link>
        {viewState.subreddits.map((x) => (
          <Link key={x.id} to={`/r/${x.name}`} onClick={toggleRedditsNav}>
            {x.name}
          </Link>
        ))}
      </nav>
    </header>
  );
}
