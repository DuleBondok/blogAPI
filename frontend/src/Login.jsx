import { useState } from "react";
import React from "react";
import "./App.css"
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Login() {
      const [showPassword, setShowPassword] = useState(false);
      const navigate = useNavigate();
       useEffect(() => {
              document.title = "Log In | blogster";
            }, []);
    return (
      <div>
        <Header />
        <div className="backgroundSignUpDiv">
          <div className="signUpDiv">
            <h1 className="signUpHeader">Welcome back!</h1>
            <p className="signUpParagraph">Please log in to access your account ✌️</p>
            <div className="logInFormDiv">
              <label className="signUpLabel">Username</label>
              <input type="text" className="signUpInput" required></input>
              <label className="signUpLabel">Password</label>
              <div className="passwordInputDiv">
                <input type={showPassword ? "text" : "password"} className="signUpInputPassword" required></input>
                <button className="inputButton" onClick={() => setShowPassword(!showPassword)}><img src={showPassword ? "./show.png" : "./hide.png"} className="showImg"></img></button>
              </div>
              <button className="signUpConfirmBtn">Log In</button>
              <div className="signUpInfoDiv" style={{display: "flex", flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "center", gap: "0.3vw"}}>
                <p style={{fontFamily: "sans-serif", fontSize: "1.2rem"}}>Not a member?</p>
                <p className="signUpParagraph1" onClick={() => navigate("/login")}>Sign up here.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default Login;
  