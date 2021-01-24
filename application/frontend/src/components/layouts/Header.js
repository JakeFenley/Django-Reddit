import React, {
  Fragment,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import { Link } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalContext";
import { logout } from "../../api-calls/requests/logout";
import { loggedOutState } from "../../context/initialState";

export default function Header() {
  const { userState, setUserState, setAlertMessages, viewState } = useContext(
    GlobalContext
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const menuContainer = useRef(null);

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

  const handleWindowClick = (e) => {
    if (
      e.target != menuContainer.current &&
      e.target.parentNode != menuContainer.current
    ) {
      toggleMenu();
      window.removeEventListener("click", handleWindowClick);
    }
  };

  const toggleMenu = () => {
    if (menuOpen) {
      setMenuOpen(false);
    } else {
      setMenuOpen(true);
    }
  };

  useEffect(() => {
    if (menuOpen) {
      window.addEventListener("click", handleWindowClick);
    }
  }, [menuOpen]);

  return (
    <header>
      <nav className="navigation">
        <ul
          ref={menuContainer}
          className={menuOpen === true ? "menu open" : "menu"}
        >
          <li>
            <Link to="/" onClick={toggleMenu}>
              Home
            </Link>
          </li>
          {viewState.subreddits.map((x) => (
            <li key={x.id}>
              <Link to={`/r/${x.name}`} onClick={toggleMenu}>
                {x.name}
              </Link>
            </li>
          ))}
        </ul>
        <button onClick={toggleMenu}>
          {viewState.subreddit ? viewState.subreddit : "Home"}
        </button>
        <ul className="right-col">
          <li className="user-name">
            {userState.user ? `Logged in as: ${userState.user}` : ""}
          </li>
          {userState.user ? userLoggedIn : userLoggedOut}
        </ul>
      </nav>
    </header>
  );
}
