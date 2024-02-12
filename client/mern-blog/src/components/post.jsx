import { format } from "date-fns";
import { Link } from "react-router-dom";

// post component called in IndexPage.jsx
export default function Post({
  title,
  summary,
  cover,
  createdAt,
  author,
  _id,
}) {
  return (
    <Link to={`/post/${_id}`}>
      <div className="entry">
        <div>
          <img
            src={"https://mern-blogger-eb273b6050cf.herokuapp.com/" + cover}
            alt=""
          />
        </div>
        <div className="text">
          <h2> {title} </h2>

          <div className="info">
            <p href="" className="author">
              by: {author.username}
            </p>
            <time> {format(new Date(createdAt), "MMM d, yyyy HH:mm")} </time>
          </div>
          <p className="summary">{summary}</p>
        </div>
      </div>
    </Link>
  );
}
