import logo from "./logo.svg";
import "./App.css";
import React from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

function Homepage() {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Home | blogster";
  }, []);

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch posts from the backend
    axios
      .get("http://localhost:5000/posts")
      .then((response) => {
        console.log("Fetched posts:", response.data);
        if (Array.isArray(response.data)) {
          setPosts(response.data);
        } else {
          setPosts([]); // Handle unexpected response structure
        }
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setPosts([]); // Handle error case
      });
  }, []);

  return (
    <div>
      <Header />
      <div className="underHeaderDiv">
        <div className="welcomeToDiv">
          <h1 className="welcomeToHeader">Welcome to</h1>
          <h1 className="blogsterHeader">blogster</h1>
          <p className="welcomeText">
            Hello! My name is Dusan Bondokic. I am a full stack developer based
            in Nis, Serbia. This is my personal blog. Journey with me through my
            life's adventures, musings, and reflections.
          </p>
          <div className="welcomeButtonsDiv">
            <button
              className="welcomeSignInBtn"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
            <button
              className="gitHubBtn"
              onClick={() =>
                window.open("https://github.com/dulebondok", "_blank")
              }
            >
              <img src="./github.png" className="gitHubIcon"></img>GitHub
            </button>
          </div>
        </div>
        <img src="./laptop.jpg" className="laptopImg"></img>
      </div>
      <div className="postListDiv">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="postCard">
              {post.image && <img className="postImg" src={`http://localhost:5000${post.image}`} alt="Post" />}
              <h2 className="postTitle">{post.title}</h2>
              <p className="postAuthor">
                {post.author.username}
              </p>
              <p className="postContent">{post.content.length > 100 ? post.content.substring(0, 180) + "..." : post.content}</p>
            </div>
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </div>
    </div>
  );
}

export default Homepage;
