import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";
import { getUser } from "../api-calls/requests/getUser";
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

export default function App() {
  const [userState, setUserState] = useState(initialState);
  const [alertMessages, setAlertMessages] = useState(initialErrorState);
  const [viewState, setViewState] = useState(initialViewState);

  const options = {
    position: positions.TOP_CENTER,
    timeout: 5000,
  };

  useEffect(async () => {
    if (localStorage.token && !userState.isAuthenticated) {
      const response = await getUser(localStorage.token);
      setUserState(response.newUserState);
    } else if (!localStorage.token) {
      setUserState(loggedOutState);
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
          <Wrapper />
        </AlertProvider>
      </GlobalContext.Provider>
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
