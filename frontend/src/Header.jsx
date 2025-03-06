import React from "react";
import './App.css';
import { useNavigate } from "react-router-dom";

function Header() {
    const navigate = useNavigate();
    return (
        <div className="headerDiv">
            <div className="headerLogoDiv">
                <img src="./blog.png" className="logoImg"></img>
                <h1 className="headerText">blogster</h1>
                <button className="homeBtn" onClick={() => navigate("/")}>Home</button>
            </div>
            <div className="headerNavDiv">
                <img src="./night.png" className="nightModeImg"></img>
                <button className="logInBtn" onClick={() => navigate("/login")}>Log In</button>
                <button className="signUpBtn" onClick={() => navigate("/signup")}>Sign Up</button>
            </div>

        </div>
    )
}

export default Header;