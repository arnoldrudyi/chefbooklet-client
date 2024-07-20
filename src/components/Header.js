import React, { useState, useEffect } from 'react';
import { useCookies, CookiesProvider } from 'react-cookie';
import axios from 'axios';
import config from '../config';

import SearchSuggestions from './SearchSuggestions';
import Sidebar from './Sidebar';

import '../styles/Header.css';
import logo from '../images/logo.png';
import arrowImage from '../images/arrow.svg';
import starIcon from '../images/star-icon-logo.svg';
import logoutIcon from '../images/logout-icon.svg';
import { MenuOutlined, MenuFoldOutlined } from '@ant-design/icons';

export default function Header({ toggleLogin, toggleSignup, showLogin, showSignup, showPopover, setShowPopover }) {
  const [tempInputData, setTempInputData] = useState('');
  const [query, setQuery] = useState({ chosenIngredients: [], inputData: '' });
  const [JWTokens, setJWTokens, removeJWTokens] = useCookies(['refresh', 'access']);
  const [userData, setUserData, removeUserData] = useCookies(['first_name']);
  const [showMarkup, setShowMarkup] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [scrollToManual, setScrollToManual] = React.useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('scrollToManual')) {
        setScrollToManual(true);
    }
  }, []);

  useEffect(() => {
    if (scrollToManual) {
        const element = document.getElementById('manual');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
  }, [scrollToManual]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setQuery(prevQuery => ({ ...prevQuery, inputData: tempInputData }));
    }, 250);
      setShowMarkup(true);
    return () => clearTimeout(timeoutId);
  }, [tempInputData]);

  const handleChange = (event) => {
    setTempInputData(event.target.value);
    setShowMarkup(true);
  }
  
  const handleKeyDown = (event) => {
    if (event.key === 'Backspace' & query.chosenIngredients.length > 0 & query.inputData === '') {
      const updatedChosenIngredients = query.chosenIngredients.slice(0, -1);
      setQuery((prevQuery) => ({...prevQuery, chosenIngredients: updatedChosenIngredients}));
    }
  };

  const removeIngredient = (indexToRemove) => {
    const updatedChosenIngredients = query.chosenIngredients.filter((value, index) => index !== indexToRemove);
    setQuery((prevQuery) => ({...prevQuery, chosenIngredients: updatedChosenIngredients}));
  };

  const setChosen = (ingredientName) => {
    setQuery(prevQuery => ({
      chosenIngredients: prevQuery.chosenIngredients.push(ingredientName),
      ...prevQuery
    }));
    setTempInputData('');
  };

  const chosenIngredientElements = query.chosenIngredients.map((ingredientName, index) => (
    <div key={index} className='chosen-ingredient' onClick={() => removeIngredient(index)}>
      {ingredientName.charAt(0).toUpperCase() + ingredientName.slice(1)}
    </div>
  ));

  function getSearchURL() {
    const chosenIngredients = query.chosenIngredients.join('&q=');
    return `/search/?q=${chosenIngredients}`;
  }

  const logout = async () => {
    try {
      await axios.post(`${config.serverUrl}/auth/logout/`, {
          'refresh': JWTokens.refresh
        })
        .then(response => {
          if (response.status === 200) {
            removeJWTokens('refresh', { path: '/' });
            removeJWTokens('access', { path: '/' });
            removeUserData('first_name', { path: '/' });
            window.location.href = '/';
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  const toggleSidebar = () => {
    if (showSidebar) {
      document.body.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'hidden';
    };
    setShowSidebar(!showSidebar);
  };

  const handleScrollToManual = () => {
    if (window.location.pathname !== '/') {
      window.location.href = '/?scrollToManual=true';
    } else {
      setScrollToManual(true);
    }
    toggleSidebar();
  }

  return (
    <div className='header' style={showSignup || showLogin ? {filter: "blur(5px)"} : {}} onClick={() => showPopover && setShowPopover(false)}>
      <div className='header-sidebar-button'>
        {showSidebar ? <MenuFoldOutlined onClick={toggleSidebar}/> : <MenuOutlined onClick={toggleSidebar}/>}
        {showSidebar && <Sidebar toggleSidebar={toggleSidebar} userData={userData} toggleLogin={toggleLogin} logout={logout} scrollToManual={handleScrollToManual} />}
      </div>
      <a href='/'>
        <div className='header-logo'>
          <img src={logo} alt='logo'/>
          <span>ChefBooklet</span>
        </div>
      </a>
      <div className='header-searchbox'>
        {chosenIngredientElements}
        <input type='text' placeholder={query.chosenIngredients.length === 0 ? 'Search for dishes by ingredients' : ''} className='header-search-input' value={tempInputData} onChange={handleChange} onKeyDown={handleKeyDown}/>
        {query.chosenIngredients.length > 0 && (
          <img src={arrowImage} alt='search' className='header-search-icon' onClick={() => window.location.href = getSearchURL()} />
        )}
        <div className='header-search-suggestions'>
          <SearchSuggestions query={query} setChosen={setChosen} />
        </div>
      </div>
      <CookiesProvider>
        {JWTokens.access ? (
          <div className='header-account' onClick={() => setShowPopover(true)}>
            {userData.first_name ? (
              <>
                <span>{userData.first_name.charAt(0)}</span>
                <div className='header-account-popover' style={showPopover ? {display: 'flex'} : {display: 'none'}}>
                    <div className='menu-option' onClick={() => window.location.href = '/account/favourites'}>
                      <img src={starIcon} alt='Favourites' />
                      Favourites
                    </div>
                    <div className='menu-option' onClick={logout}>
                      <img src={logoutIcon} alt='Logout' />
                      Logout
                    </div>
                </div>
              </>
            ) : (
              <span></span>
            )}
          </div>
        ) : (
          <div className='header-buttons'>
            <button className='login' onClick={toggleLogin}>Log in</button>
            <button className='signup' onClick={toggleSignup}>Sign up</button>
          </div>
        )}
      </CookiesProvider>
    </div>
  );
};