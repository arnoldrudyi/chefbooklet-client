import React from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";

import errorHat from '../images/error-hat.png';

export default function ErrorPage({ showSignup, showLogin, toggleSignup, toggleLogin, showPopover, setShowPopover }) {
  return (
    <>
      <Header toggleSignup={toggleSignup} toggleLogin={toggleLogin} showLogin={showLogin} showSignup={showSignup} showPopover={showPopover} setShowPopover={setShowPopover} />
      <div className={`app ${showSignup || showLogin ? 'blur' : ''}`} onClick={() => showPopover && setShowPopover(false)} >
        <div className="error-nothing-found">
          <img src={errorHat} alt="Error" />
          <div>
            <p className="error-nothing-found-header">Oops! Page Not Found!</p>
            <p>It seems like you've taken a wrong turn! The page you're looking for might have been moved, deleted, or doesn't exist.</p>
          </div>
        </div>
      </div>
      <Footer showLogin={showLogin} showSignup={showSignup} />
    </>
  );
};