import { useState } from "react";
import React from "react";
import "./App.css";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Log In | blogster";
  }, []);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/login", formData);
      console.log("Login successful", response.data);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      if (response.data.role === "admin") {
        navigate("/admin");
    } else {
        navigate("/profile");
    } }
    catch (error) {
      console.error("Login failed:", error);
      setError(error.response?.data?.message || "Invalid username or password");
    }
  };
  return (
    <div>
      <Header />
      <div className="backgroundSignUpDiv">
        <div className="signUpDiv">
          <h1 className="signUpHeader">Welcome back!</h1>
          <p className="signUpParagraph">
            Please log in to access your account ✌️
          </p>
          {error && <p className="errorMessage">{error}</p>}
          <div className="logInFormDiv">
            <form className="logInFormDiv" onSubmit={handleSubmit}>
              <label className="signUpLabel">Username</label>
              <input
                name="username"
                type="text"
                className="signUpInput"
                required
                value={formData.username}
                onChange={handleInputChange}
              ></input>
              <label className="signUpLabel">Password</label>
              <div className="passwordInputDiv">
                <input
                  type={showPassword ? "text" : "password"}
                  className="signUpInputPassword"
                  required
                  value={formData.password}
                  name="password"
                  onChange={handleInputChange}
                ></input>
                <button
                  className="inputButton"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <img
                    src={showPassword ? "./show.png" : "./hide.png"}
                    className="showImg"
                  ></img>
                </button>
              </div>
              <button className="signUpConfirmBtn">Log In</button>
            </form>
            <div
              className="signUpInfoDiv"
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.3vw",
              }}
            >
              <p style={{ fontFamily: "sans-serif", fontSize: "1.2rem" }}>
                Not a member?
              </p>
              <p
                className="signUpParagraph1"
                onClick={() => navigate("/login")}
              >
                Sign up here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
