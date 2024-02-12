import "./App.css";

import { Route, Routes } from "react-router-dom";
import Layout from "./layout";
import IndexPage from "./Pages/IndexPage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import { UserContextProvider } from "./UserContext";
import CreatePost from "./Pages/CreatePost";
import PostPage from "./Pages/PostPage";
import EditPost from "./Pages/EditPost";
import NotFound from "./Pages/NotFound";

//UserContextProvider used to keep track of user logged in
// Layout used to set header on every page

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/createpost" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/edit/:id" element={<EditPost />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
