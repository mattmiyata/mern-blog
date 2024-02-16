import Post from "../components/post";
import { useEffect, useState } from "react";
// hompage fetches and displays posts
export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("https://mern-blogger-eb273b6050cf.herokuapp.com/api/post").then(
      (response) => {
        response.json().then((posts) => {
          setPosts(posts);
          setLoading(false);
          //console.log(posts);
        });
      }
    );
  }, []);
  return (
    <>
      {loading ? (
        <div className="spinner">
          <div className="bounce1"></div>
          <div className="bounce2"></div>
          <div className="bounce3"></div>
        </div>
      ) : (
        <div className="homePage-container">
          {posts.length > 0 &&
            posts.map((post) => <Post {...post} key={post._id} />)}
        </div>
      )}
    </>
  );
}
