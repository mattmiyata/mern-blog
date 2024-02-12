import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import { Navigate } from "react-router-dom";
// header is set in layout.jsx which sets to App.jsx
export default function Header() {
  //sets userInfo in useContext
  const { setUserInfo, userInfo } = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);

  //checks to see if logged in
  useEffect(() => {
    fetch("http://localhost:4000/profile", {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, [setUserInfo]);

  // sets redirect back to false after redirected
  useEffect(() => {
    setRedirect(false);
  }, [redirect]);

  // sets userInfo to null when logged out
  function logout() {
    fetch("http://localhost:4000/logout", {
      credentials: "include",
      method: "POST",
    });
    setUserInfo({
      id: null,
      username: null,
    });
    // sets redirect state to true which is changed by useeffect after redirect
    setRedirect(true);
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }
  const username = userInfo?.username;
  // conditionally renders header based on login status
  return (
    <header>
      <Link to="/" className="logo">
        Blogger
      </Link>
      <nav>
        {username && (
          <>
            <h2>Welcome back, {username}</h2>
            <Link to="/createpost">Create new post</Link>
            <a onClick={logout}>Logout</a>
          </>
        )}
        {!username && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
