import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { UserContext } from "../UserContext";

export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const [postDeleted, setPostDeleted] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [error, setError] = useState(true);
  const { userInfo } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  // called on render to fetch post data from database and sets to state
  useEffect(() => {
    fetch(
      `https://mern-blogger-eb273b6050cf.herokuapp.com/api/post/${id}`
    ).then((response) => {
      response.json().then((postInfo) => {
        setPostInfo(postInfo);
        setLoading(false);
      });
    });
  }, []);

  // called on delete and sends id and token
  async function deletePost() {
    const data = new FormData();
    data.set("id", id);
    // e.preventDefault();

    const response = await fetch(
      `https://mern-blogger-eb273b6050cf.herokuapp.com/api/post/${id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
    // used to redirect after delete
    if (response.ok) {
      setPostDeleted(true);
    } else {
      response.json().then((error) => {
        setError(error.message);
      });
    }
  }
  // reroutes after post deleted
  if (postDeleted) {
    return (
      <div>
        <h1>The post has been deleted successfully</h1>
        <Link to={"/"}>Go Back</Link>
      </div>
    );
  }

  if (error) {
    <div>
      <h1>Somthing went wrong!</h1>
    </div>;
  }

  return (
    <>
      {loading ? (
        <div className="spinner">
          <div className="bounce1"></div>
          <div className="bounce2"></div>
          <div className="bounce3"></div>
        </div>
      ) : (
        <div className="post-page">
          {/* Author and title */}
          <h1>{postInfo.title}</h1>
          <time> {formatISO9075(new Date(postInfo.createdAt))} </time>
          <div className="author">by {postInfo.author.username} </div>
          {/* checks to see if logged in user is same as author to render edit and delete buttons */}
          {userInfo.id === postInfo.author._id && (
            <div className="edit-row">
              {/* edit button (Link) */}
              <Link to={`/edit/${postInfo._id}`} className="edit-btn">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                  />
                </svg>
                Edit this post
              </Link>
              {/* delete button, if pressed will bring up Modal */}
              {showButton && (
                <button onClick={() => setShowButton(!showButton)}>
                  delete
                </button>
              )}
              {/* Modal */}
              {!showButton && (
                <div className="modal-background">
                  <div className="modal-container">
                    <div className="body">
                      <p>Are you sure you want to delete this post?</p>
                    </div>
                    <div className="footer">
                      <button onClick={() => setShowButton(!showButton)}>
                        Cancel
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => deletePost()}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {/* sets image */}
          <div className="image">
            <img
              src={`https://mern-blogger-eb273b6050cf.herokuapp.com/${postInfo.cover}`}
              alt=""
            />
          </div>
          {/* sets content */}
          <div
            dangerouslySetInnerHTML={{ __html: postInfo.content }}
            className="content"
          />
        </div>
      )}
    </>
  );
}
