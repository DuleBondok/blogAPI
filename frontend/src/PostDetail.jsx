import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import "./App.css";

function PostDetail() {
  const token = localStorage.getItem("token");
  const { id } = useParams(); // id will serve as the postId
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/posts/${id}`)
      .then((response) => {
        console.log("Fetched post data:", response.data);
        setPost(response.data);
      })
      .catch((error) => console.error("Error fetching post:", error))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!post) return <p>Post not found</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content) {
      alert("Please enter a comment.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/create-comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content, postId: id }), // Use 'id' as postId
      });

      const data = await response.json();

      if (response.ok) {
        alert("Comment submitted successfully!");
        setContent(""); // Clear the content input after submission
      } else {
        alert(data.message || "Error submitting comment");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div>
      <Header />
      <div className="postDetailDiv">
        {post.image && (
          <img
            className="postDetailImg"
            src={`http://localhost:5000${post.image}`}
            alt="Post"
          />
        )}
        <h1 className="postDetailHeader">
          {post.title || "No title available"}
        </h1>
        <p className="postDetailAuthor">
          {post.author ? post.author.username : "Unknown"}
        </p>
        <p className="postDetailContent">
          {post.content || "Content not available"}
        </p>
        {token ? (
          <div className="addCommentDiv">
            <h1 className="addCommentHeader">Leave a comment</h1>
            <textarea
              className="addCommentInput"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
            <button type="submit" className="addCommentBtn" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        ) : (
          <h1>Please log in to leave a comment!</h1>
        )}
        <div className="commentListDiv">
          <h1 className="commentsHeader">Comments</h1>
        </div>
      </div>
    </div>
  );
}

export default PostDetail;