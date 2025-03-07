import React from "react";
import { useNavigate } from "react-router-dom";

const LogoutBtn = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // Optionally, you can also clear sessionStorage if you're using it:
    // sessionStorage.removeItem("token");
    // sessionStorage.removeItem("role");

    // Redirect the user to the login page or home page
    navigate("/login");
  };

  return (
    <button onClick={handleLogout}>Log out</button>
  );
};

export default LogoutBtn;