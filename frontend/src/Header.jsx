import React from "react";
import './App.css';

function Header() {
    return (
        <div className="headerDiv">
            <div className="headerLogoDiv">
                <img src="./blog.png" className="logoImg"></img>
                <h1 className="headerText">blogster</h1>
                <button className="homeBtn">Home</button>
            </div>
            <div className="headerNavDiv">
                <img src="./night.png" className="nightModeImg"></img>
                <button className="logInBtn">Log In</button>
                <button className="signUpBtn">Sign Up</button>
            </div>

        </div>
    )
}

export default Header;