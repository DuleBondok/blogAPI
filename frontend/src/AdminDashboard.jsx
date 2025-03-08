import React from "react";
import { useState } from "react";
import LogoutBtn from "./LogoutBtn";
import Header from "./Header";
import "./App.css";
import axios from "axios";

const AdminDashboard = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    authorId: localStorage.getItem("userId") || "",
    image: null,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated.");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    data.append("authorId", formData.authorId);
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/create-post",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        setSuccess("Post created successfully!");
        setError("");
      } else {
        setError("Unexpected response format.");
      }
    } catch (err) {
      setError(
        "Error creating post: " + (err.response?.data?.message || err.message)
      );
      setSuccess("");
    }
  };
  return (
    <div>
      <Header />
      <h1 className="adminDashboardHeader">Admin dashboard</h1>
      <div className="newPostDiv">
        <h1>Create a new post</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <label className="postLabel">Title</label>
          <input
            type="text"
            name="title"
            className="postInput"
            value={formData.title}
            onChange={handleChange}
          ></input>
          <label className="postLabel">Add image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            required
            onChange={handleChange}
          />

          <label className="postLabel">Text:</label>
          <textarea
            className="postInputText"
            name="content"
            value={formData.content}
            onChange={handleChange}
          ></textarea>
          <button type="submit" style={{ marginBottom: "1.5vh" }}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
