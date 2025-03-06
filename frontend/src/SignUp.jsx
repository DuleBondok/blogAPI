import { useState } from "react";
import React from "react";
import "./App.css"
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        document.title = "Sign Up | blogster";
      }, []);
    return (
        <div>
            <Header />
            <div className="backgroundSignUpDiv">
                <div className="signUpDiv">
                    <h1 className="signUpHeader">Sign up</h1>
                    <p className="signUpParagraph">To post comments and join the community!</p>
                    <div className="signUpFormDiv">
                        <label className="signUpLabel">Username</label>
                        <input type="text" className="signUpInput" required></input>
                        <label className="signUpLabel">Password</label>
                        <div className="passwordInputDiv">
                            <input type={showPassword ? "text" : "password"} className="signUpInputPassword" required></input>
                            <button className="inputButton" onClick={() => setShowPassword(!showPassword)}><img src={showPassword ? "./show.png" : "./hide.png"} className="showImg"></img></button>
                        </div>
                        <label className="signUpLabel">Confirm password</label>
                        <div className="passwordInputDiv">
                            <input type={showPassword ? "text" : "password"} className="signUpInputPassword" required></input>
                            <button className="inputButton" onClick={() => setShowPassword(!showPassword)}><img src={showPassword ? "./show.png" : "./hide.png"} className="showImg" ></img></button>
                        </div>
                        <button className="signUpConfirmBtn">Sign Up</button>
                        <div className="signUpInfoDiv" style={{display: "flex", flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "center", gap: "0.3vw"}}>
                            <p style={{fontFamily: "sans-serif", fontSize: "1.2rem"}}>Already a user?</p>
                            <p className="signUpParagraph1" onClick={() => navigate("/login")}>Log in here.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 

export default SignUp;