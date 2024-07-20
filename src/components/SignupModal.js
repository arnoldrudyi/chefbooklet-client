import React, { useEffect, useState } from "react";
import axios from "axios";
import AOS from 'aos';
import { CookiesProvider, useCookies } from 'react-cookie';
import config from '../config';

import 'aos/dist/aos.css';
import eyeIcon from '../images/eye-icon.svg';
import tickIcon from '../images/tick-icon.svg';

import '../styles/SignupModal.css';

export default function Signup({ showSignup, toggleLogin, onClose }) {
  const [isPasswordShown, setIsPasswordShown] = React.useState(false);
  const [cookies, setCookies] = useCookies(['refresh', 'access']);
  const [formData, setFormData] = useState({first_name: "", email: "", password: ""});
  const [validationError, setValidationError] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 700 });
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const registerAccount = async (event) => {
    event.preventDefault();

    if (formData.first_name && formData.email && formData.password) {
      try {
        const status = await axios.post(`${config.serverUrl}/customer/register/`, formData)
          .then(response => {
            setCookies('access', response.data.access, { path: '/', maxAge: 10800 })
            setCookies('refresh', response.data.refresh, { path: '/' })
          });
      } catch (error) {
        if (Object.keys(error.response.data)) {
          setValidationError(Object.keys(error.response.data));
        }

        console.log(validationError);
        console.error(error);
      }
    };
  };

  return (
    <>
    {showSignup && (
      <CookiesProvider>
        <div className='signup-form-wrapper' onClick={(e) => onClose(e, cookies.access ? true : false)}>
          <div className='signup-form' onClick={(e) => e.stopPropagation()} data-aos="fade-down">
            <div className='signup-form-image'>
              <img src={require('../images/modals/georgian-dishes.jpeg')} alt="signup banner" />
            </div>
              <div className='signup-form-content'>
                {cookies.access ? (
                  <>
                    <span className="close-icon" onClick={() => window.location.reload()}>&#10005;</span>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', height: '100%' }}>
                      <img src={tickIcon} style={{ width: '180px' }} alt="tick icon" />
                      <p style={{ fontWeight: 600, fontSize: '1.5rem', margin: '40px 0 0 0' }}>Welcome Aboard!</p>
                      <p style={{ fontSize: "0.9rem" }}>Thanks for joining us! Get ready for a flavorful adventure filled with recipes and useful tips.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="close-icon" onClick={onClose}>&#10005;</span>
                    <h2>Create Account</h2>
                    <form className='signup-form-inputs' onSubmit={registerAccount}>
                      <input 
                        type="text" 
                        placeholder="First Name" 
                        id="first-name" 
                        className="first-name-input" 
                        name="first_name" 
                        style={validationError.includes('first_name') ? {borderColor: '#F17171'} : {}}
                        value={formData.first_name} 
                        onChange={handleChange}
                      />
                      <input 
                        type="text" 
                        placeholder="E-mail" 
                        id="email" 
                        className='email-input' 
                        name="email" 
                        style={validationError.includes('email') ? {borderColor: '#F17171'} : {}}
                        value={formData.email} 
                        onChange={handleChange}
                      />
                      <div className='password-container'>
                        <input 
                          type={isPasswordShown ? 'text' : 'password'} 
                          placeholder="Password" 
                          id="password" 
                          className='password-input' 
                          name="password" 
                          style={validationError.includes('password') ? {borderColor: '#F17171'} : {}}
                          value={formData.password} 
                          onChange={handleChange}
                        />
                        <span className='toggle-password' onClick={() => setIsPasswordShown(isShown => !isShown)} style={isPasswordShown ? { backgroundColor: "#E1ECD8" } : {}}>
                          <img src={eyeIcon} alt='eye icon'/>
                        </span>
                      </div>
                      <button>Create Account</button>
                    </form>
                    <div className='signup-form-login-option'>
                      <div className='divider'></div>
                      <p>Already have an account yet? <span style={{ color: "#8CC25F", cursor: "pointer" }} onClick={toggleLogin}>Sign in</span></p>
                    </div>
                  </>
                )}
              </div>
          </div>
        </div>
      </CookiesProvider>
    )}
    </>
  );
}