import React from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import config from './config';

import HomePage from './components/HomePage';
import DishPage from './components/DishPage';
import NationalityPage from './components/NationalityPage';
import SearchResults from './components/SearchResults';
import FavouritesPage from './components/FavouritesPage';
import ErrorPage from './components/ErrorPage';

function App({ page }) {
  const [showSignup, setShowSignup] = React.useState(false)
  const [showLogin, setShowLogin] = React.useState(false)
  const [showPopover, setShowPopover] = React.useState(false)
  const [JWTokens, setJWTokens] = useCookies(['refresh', 'access'])
  const [userCookies, setUserCookies] = useCookies(['first_name'])

  const obtainNewTokens = async() => {
    try {
      await axios
        .post(`${config.serverUrl}/auth/token/refresh/`, {
          'refresh': JWTokens.refresh
        })
        .then(res => {
          setJWTokens('access', res.data.access, { path: '/', maxAge: 10800 })
          setJWTokens('refresh', res.data.refresh, { path: '/' })
        });
    } catch (e) {
      console.log(e)
    }
  }

  const obtainUserData = async() => {
    try {
      await axios
        .get(`${config.serverUrl}/customer/getData`, {
          headers: {
            'Authorization': `Bearer ${JWTokens.access}`
          }
        })
        .then(res => {
          setUserCookies('first_name', res.data.first_name, { path: '/', maxAge: 10800 })
        });
    } catch (e) {
      console.log(e)
    }
  }

  if (JWTokens.refresh && !JWTokens.access) {
    obtainNewTokens()
  } 
  
  if (JWTokens.access && !userCookies.first_name) {
    obtainUserData()
  }

  const toggleSignup = (event, isReload) => {
    if (isReload) {
      window.location.reload()
    } else {
      setShowLogin(false)
      setShowSignup(!showSignup)
      document.body.style.overflow = showSignup ? 'auto' : 'hidden'
    }
  }

  const toggleLogin = (event, isReload) => {
    if (isReload) {
      window.location.reload()
    } else {
      setShowSignup(false)
      setShowLogin(!showLogin)
      document.body.style.overflow = showLogin ? 'auto' : 'hidden'
    }
  }

  if (page === 'HomePage') {
    return (
      <HomePage showSignup={showSignup} showLogin={showLogin} toggleSignup={toggleSignup} toggleLogin={toggleLogin} showPopover={showPopover} setShowPopover={setShowPopover}/>
    );
  } else if (page === 'SearchResults') {
    return (
      <SearchResults showSignup={showSignup} showLogin={showLogin} toggleSignup={toggleSignup} toggleLogin={toggleLogin} showPopover={showPopover} setShowPopover={setShowPopover} />
    );
  } else if (page === 'DishPage') {
    return (
      <DishPage showSignup={showSignup} showLogin={showLogin} toggleSignup={toggleSignup} toggleLogin={toggleLogin} showPopover={showPopover} setShowPopover={setShowPopover} />
    )
  } else if (page === 'NationalityPage') {
    return (
      <NationalityPage showSignup={showSignup} showLogin={showLogin} toggleSignup={toggleSignup} toggleLogin={toggleLogin} showPopover={showPopover} setShowPopover={setShowPopover} />
    )
  } else if (page === 'FavouritesPage') {
    return (
      <FavouritesPage showSignup={showSignup} showLogin={showLogin} toggleSignup={toggleSignup} toggleLogin={toggleLogin} showPopover={showPopover} setShowPopover={setShowPopover} />
    )
  } else if (page === 'ErrorPage') {
    return (
      <ErrorPage showSignup={showSignup} showLogin={showLogin} toggleSignup={toggleSignup} toggleLogin={toggleLogin} showPopover={showPopover} setShowPopover={setShowPopover} />
    )
  }
}

export default App;
