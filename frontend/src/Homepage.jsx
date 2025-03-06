import logo from './logo.svg';
import './App.css';
import React from 'react';
import Header from './Header';
import { useNavigate } from "react-router-dom";

function Homepage() {
  const navigate = useNavigate();
  return (
    <div>
      <Header />
      <div className='underHeaderDiv'>
        <div className='welcomeToDiv'>
          <h1 className='welcomeToHeader'>Welcome to</h1>
          <h1 className='blogsterHeader'>blogster</h1>
          <p className='welcomeText'>Hello! My name is Dusan Bondokic. I am a full stack developer based in Nis, Serbia. This is my personal blog. Journey with me through my life's adventures, musings, and reflections.</p>
          <div className='welcomeButtonsDiv'>
            <button className='welcomeSignInBtn' onClick={() => navigate("/signup")}>Sign Up</button>
            <button className='gitHubBtn' onClick={() => window.open("https://github.com/dulebondok", "_blank")}><img src='./github.png' className='gitHubIcon'></img>GitHub</button>
          </div>
        </div>
        <img src='./laptop.jpg' className='laptopImg'></img>
      </div>
    </div>
  );
}

export default Homepage;
