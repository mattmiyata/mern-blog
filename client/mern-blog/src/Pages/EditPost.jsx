import { useEffect, useState } from "react";

import { Navigate } from "react-router-dom";
import Editor from "../components/Editor";
import { useParams } from "react-router-dom";

export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState("");
  // fetches data to populate input fields
  useEffect(() => {
    fetch("https://mern-blogger-eb273b6050cf.herokuapp.com/post/" + id).then(
      (response) => {
        response.json().then((postInfo) => {
          setTitle(postInfo.title);
          setContent(postInfo.content);
          setSummary(postInfo.summary);
        });
      }
    );
  }, [id]);
  // sets data and sends data to be saved in database
  async function editPost(e) {
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("id", id);
    if (files?.[0]) {
      data.set("file", files?.[0]);
    }
    e.preventDefault();

    const response = await fetch(
      "https://mern-blogger-eb273b6050cf.herokuapp.com/api/post",
      {
        method: "PUT",
        body: data,
        credentials: "include",
      }
    );
    if (response.ok) {
      setRedirect(true);
    } else {
      response.json().then((error) => {
        setError(error.message);
      });
    }
  }
  // redirects back to edited post
  if (redirect) {
    return <Navigate to={"/post/" + id} />;
  }
  return (
    <form onSubmit={editPost}>
      <input
        required
        type="title"
        placeholder={"title"}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        required
        type="summary"
        placeholder={"summary"}
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />
      <input type="file" onChange={(e) => setFiles(e.target.files)} />
      <div className="editor">
        <Editor required onChange={setContent} value={content} />
      </div>
      <button style={{ marginTop: "5px" }}>Update post</button>
      {error && <div>{error}</div>}
    </form>
  );
}
