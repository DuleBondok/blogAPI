import { useState } from "react";
import React from "react";
import "./App.css";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Sign Up | blogster";
  }, []);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      alert("Signup successful! Redirecting to login...");
      navigate("/login");
    } catch (error) {
      setError("Failed to connect to server");
    }
  };
  return (
    <div>
      <Header />
      <div className="backgroundSignUpDiv">
        <div className="signUpDiv">
          <h1 className="signUpHeader">Sign up</h1>
          <p className="signUpParagraph">
            To post comments and join the community!
          </p>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div className="signUpFormDiv">
            <form className="signUpFormDiv" onSubmit={handleSubmit}>
              <label className="signUpLabel">Username</label>
              <input
                type="text"
                className="signUpInput"
                required
                name="username"
                value={formData.username}
                onChange={handleChange}
              ></input>
              <label className="signUpLabel">Password</label>
              <div className="passwordInputDiv">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="signUpInputPassword"
                  required
                  value={formData.password}
                  onChange={handleChange}
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
              <label className="signUpLabel">Confirm password</label>
              <div className="passwordInputDiv">
                <input
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  className="signUpInputPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
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
              <button className="signUpConfirmBtn" type="submit">
                Sign Up
              </button>
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
                Already a user?
              </p>
              <p
                className="signUpParagraph1"
                onClick={() => navigate("/login")}
              >
                Log in here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
