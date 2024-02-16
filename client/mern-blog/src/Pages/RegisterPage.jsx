import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function RegisterPage() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState("");
  const { setUserInfo } = useContext(UserContext);
  // called when resister button clicked
  async function register(e) {
    e.preventDefault();
    // post request to server
    const response = await fetch(
      "https://mern-blogger-eb273b6050cf.herokuapp.com/api/register",
      {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-type": "application/json" },
        credentials: "include",
      }
    );
    if (response.ok) {
      response.json().then((userInfo) => {
        setRedirect(true);
        setUserInfo(userInfo);
      });
    } else {
      response.json().then((error) => {
        setError(error.message);
      });
    }
  }

  // Displays when user has been registered successfully
  if (redirect) {
    return (
      <div>
        <h1>You have been registered!</h1>
        <Link to={"/"}>Click here to get started!</Link>
      </div>
    );
  }

  return (
    <form className="register" onSubmit={register}>
      <h1>Register</h1>
      <input
        required
        type="text"
        placeholder="username"
        value={username}
        onChange={(e) => setUserName(e.target.value)}
      />
      <input
        required
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button>Register</button>
      {error && <div>{error}</div>}
    </form>
  );
}
