import { useState } from "react";
import "react-quill/dist/quill.snow.css";
import { Navigate } from "react-router-dom";
import Editor from "../components/Editor";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState("");

  // sets data and sends it to be processed
  async function createNewPost(e) {
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("file", files[0]);
    e.preventDefault();

    const response = await fetch("http://localhost:4000/post", {
      method: "POST",
      body: data,
      credentials: "include",
    });
    if (response.ok) {
      setRedirect(true);
    } else {
      response.json().then((error) => {
        setError(error.message);
      });
    }
  }

  // redirects to homepage
  if (redirect) {
    return <Navigate to={"/"} />;
  }
  return (
    <form onSubmit={createNewPost}>
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
        <Editor required value={content} onChange={setContent} />
      </div>
      <button style={{ marginTop: "5px" }}>Create post</button>
      {error && <div>{error}</div>}
    </form>
  );
}
