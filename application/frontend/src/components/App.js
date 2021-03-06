import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";
import {
  initialState,
  initialErrorState,
  initialViewState,
  loggedOutState,
} from "../context/initialState";
import { Provider as AlertProvider, positions } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import Alerts from "./layouts/Alerts";
import Wrapper from "./Wrapper";
import "./styles.scss";
import Loading from "./Loading";
import { getSubreddits } from "../api-calls/requests/getSubredits";
import { initialPageLoadAuthentication } from "../api-calls/requests/initialPageLoadAuthentication";

export default function App() {
  const [userState, setUserState] = useState(initialState);
  const [alertMessages, setAlertMessages] = useState(initialErrorState);
  const [viewState, setViewState] = useState(initialViewState);

  const options = {
    position: positions.TOP_CENTER,
    timeout: 5000,
  };

  useEffect(() => {
    const getUserState = async () => {
      if (localStorage.token && !userState.isAuthenticated) {
        const user = await initialPageLoadAuthentication();
        setUserState(user.newUserState);
      } else if (!localStorage.token) {
        setUserState(loggedOutState);
      }
    };

    const getViewState = async () => {
      try {
        const subreddits = await getSubreddits();
        const newState = {
          ...viewState,
          subreddits: subreddits,
          isLoading: false,
        };

        setViewState(newState);
      } catch (err) {
        console.log(err);
      }
    };

    getUserState();

    if (viewState.isLoading) {
      getViewState();
    }
  }, [userState.user]);

  return (
    <Router>
      <GlobalContext.Provider
        value={{
          userState,
          setUserState,
          alertMessages,
          setAlertMessages,
          viewState,
          setViewState,
        }}
      >
        <AlertProvider template={AlertTemplate} {...options}>
          <Alerts />
          {userState.isLoading || viewState.isLoading ? (
            <Loading />
          ) : (
            <Wrapper />
          )}
        </AlertProvider>
      </GlobalContext.Provider>
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
