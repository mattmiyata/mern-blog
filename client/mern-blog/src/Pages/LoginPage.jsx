import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function LoginPage() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState("");
  const { setUserInfo } = useContext(UserContext);

  // sends post request upon login
  async function login(e) {
    e.preventDefault();
    const response = await fetch(
      "https://mern-blogger-eb273b6050cf.herokuapp.com/api/login",
      {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-type": "application/json" },
        credentials: "include",
      }
    );
    //  sets user info
    if (response.ok) {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
        setRedirect(true);
      });
    } else {
      response.json().then((error) => {
        setError(error.message);
      });
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }
  return (
    <form className="login" onSubmit={login}>
      <h1>Login</h1>
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
      <button>Login</button>
      {error && <div>{error}</div>}
    </form>
  );
}
