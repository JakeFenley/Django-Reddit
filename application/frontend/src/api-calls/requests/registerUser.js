import axios from "axios";
import error from "../helpers/loginError";
import headerConfig from "../helpers/headerConfig";

export default async function registerUser(username, email, password) {
  const body = JSON.stringify({ username, email, password });

  try {
    const headers = await headerConfig();
    const response = await axios.post("/api/auth/register", body, headers);
    if (response) {
      return true;
    }
  } catch (err) {
    return false;
  }
}
