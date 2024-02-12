import Post from "../components/post";
import { useEffect, useState } from "react";
// hompage fetches and displays posts
export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch("https://mern-blogger-eb273b6050cf.herokuapp.com/api/post").then(
      (response) => {
        response.json().then((posts) => {
          setPosts(posts);
          //console.log(posts);
        });
      }
    );
  }, []);
  return (
    <div className="homePage-container">
      {posts.length > 0 &&
        posts.map((post) => <Post {...post} key={post._id} />)}
    </div>
  );
}
