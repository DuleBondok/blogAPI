import React from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

const LogoutBtn = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate("/login");
  };

  return <button onClick={handleLogout} className="logOutBtn"><img src="/logout.png" className="logOutImg"></img>Log out</button>;
};

export default LogoutBtn;
