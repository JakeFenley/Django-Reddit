import React, { useContext, useState } from "react";
import { Redirect } from "react-router";
import registerUser from "../../api-calls/requests/registerUser";
import { GlobalContext } from "../../context/GlobalContext";
export default function Register() {
  const { setAlertMessages } = useContext(GlobalContext);

  const [registerSuccess, setRegisterSuccess] = useState(false);

  const authRegister = async e => {
    e.preventDefault();
    const { username, email, password, password2 } = e.target;
    const usernameValidation = new RegExp("^[0-9a-zA-Z]*$");
    const usernameValidated = usernameValidation.test(username.value);

    if (
      !username.value ||
      !email.value ||
      !password.value ||
      !password2.value ||
      !usernameValidated
    ) {
      setAlertMessages([
        "Fields must not be left blank, Username must contain only alphanumeric characters",
      ]);
      return;
    }

    if (password.value === password2.value && password.value.length > 7) {
      const success = await registerUser(
        username.value,
        email.value,
        password.value
      );
      if (success) {
        setRegisterSuccess(true);
        setAlertMessages(["Account Created Please Login"]);
      } else {
        setAlertMessages(["Something went wrong, try again"]);
      }
    } else {
      setAlertMessages([
        "Passwords must match and be at least 8 characters long",
      ]);
    }
  };

  if (registerSuccess) {
    return <Redirect to="/login" />;
  }

  return (
    <form onSubmit={authRegister}>
      <label htmlFor="email">Email</label>
      <input type="email" id="email" name="email" placeholder="Email*"></input>
      <label htmlFor="username">Username</label>
      <input
        type="text"
        id="username"
        name="username"
        placeholder="Username*"
      ></input>
      <label htmlFor="password">Password</label>
      <input
        type="password"
        id="password"
        name="password"
        placeholder="Password*"
        autoComplete="new-password"
      ></input>
      <label htmlFor="password2">Confirm Password</label>
      <input
        type="password"
        id="password2"
        name="password2"
        placeholder="Password*"
        autoComplete="new-password"
      ></input>

      <button type="submit">Sign Up</button>
    </form>
  );
}
