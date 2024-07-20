import React, { useState, useEffect } from "react";
import axios from "axios";
import AOS from 'aos';
import { useCookies } from 'react-cookie';
import config from '../config';

import 'aos/dist/aos.css';
import eyeIcon from '../images/eye-icon.svg';

import '../styles/LoginModal.css';

export default function Login({ showLogin, toggleSignup, onClose }) {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [cookies, setCookie] = useCookies(['refresh', 'access']);
  const [formData, setFormData] = useState({email: "", password: ""});
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    AOS.init({ duration: 700 });
  }, []);

  function handleChange(event) {
    if (event.target.name === loginError) {
      setLoginError('');
    }

    setFormData(prevFormData => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value
      }
    });
  };

  const login = async (event) => {
    event.preventDefault()

    if (formData.email && formData.password) {
      try {
        await axios.post(`${config.serverUrl}/auth/login/`, formData)
          .then(response => {
            setCookie('access', response.data.access, { path: '/', maxAge: 10800 });
            setCookie('refresh', response.data.refresh, { path: '/' });
            window.location.reload();
          });
      } catch (error) {
        console.error(error);
        if (error.response.data.detail === 'User not found') {
          setLoginError('email');
        } else if (error.response.data.detail === 'Incorrect password') {
          setLoginError('password');
        }
      }
    };
  };

  return (
    <>
    {showLogin && (
      <div className='login-form-wrapper' onClick={onClose}>
        <div className='login-form' onClick={(e) => e.stopPropagation()} data-aos="fade-down">
          <div className='login-form-image'>
            <img src={require('../images/modals/italian-dishes.png')} alt="login banner" />
          </div>
          <div className='login-form-content'>
            <span className="close-icon" onClick={onClose}>&#10005;</span>
            <h2>Sign in</h2>
            <form className='login-form-inputs' onSubmit={login}>
              <input 
                type="text" 
                placeholder="E-mail" 
                id="email" 
                className='email-input' 
                name="email" 
                value={formData.email} 
                style={loginError === 'email' ? {borderColor: '#F17171'} : {}} 
                onChange={handleChange}
              />
              <div className='login-password-container'>
                <input 
                  type={isPasswordShown ? 'text' : 'password'} 
                  placeholder="Password" 
                  id="password" 
                  className='password-input' 
                  name="password" 
                  value={formData.password} 
                  style={loginError === 'password' ? {borderColor: '#F17171'} : {}} 
                  onChange={handleChange}
                />
                <span className='toggle-password' onClick={() => setIsPasswordShown(isShown => !isShown)} style={isPasswordShown ? {backgroundColor: "#E1ECD8"} : {}}>
                  <img src={eyeIcon} alt='eye icon'/>
                </span>
              </div>
              <button>Sign In</button>
            </form>
            <div className='login-form-signup-option'>
              <div className='divider'></div>
              <p>Don't have an account yet? <span style={{color: "#8CC25F", cursor: "pointer"}} onClick={toggleSignup}>Sign up</span></p>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}