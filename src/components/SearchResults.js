import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";
import HashLoader from "react-spinners/HashLoader";
import config from '../config';

import Header from './Header';
import Pagination from "./Pagination";
import Footer from './Footer';
import DishCard from "./DishCard";
import SignupModal from './SignupModal';
import LoginModal from './LoginModal';

import '../styles/SearchResults.css';
import errorHat from '../images/error-hat.png';

export default function SearchResults({ showSignup, showLogin, toggleSignup, toggleLogin, showPopover, setShowPopover }) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search).getAll('q');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = React.useState(0);
  const [isOffsetSet, setIsOffsetSet] = React.useState(false);
  const [totalObjects, setTotalObjects] = React.useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pageParam = params.get('page');
    if (pageParam) {
      setOffset(parseInt((pageParam - 1) * 10, 0));
    } else {
      setOffset(0);
    }
    setIsOffsetSet(true);
  }, [location.search]);

  useEffect(() => {
    if (isOffsetSet) {
      const getSearchResults = async () => {
        const chosenIngredients = queryParams.map(ingredient => ingredient.replace(' ', '+')).join('&q=');
        
        try {
            await axios.get(`${config.serverUrl}/dish/search/?q=${chosenIngredients}&offset=${offset}`)
              .then(response => {
                setSearchResults(response.data.result);
                setTotalObjects(response.data.total);
              });
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
  
      getSearchResults();
    }
  }, [offset, isOffsetSet]);

  const handlePageChange = (page) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('page', page);
    const newUrl = `${location.pathname}?${searchParams.toString()}`;

    navigate(newUrl);
  };

  const dishElements = searchResults.map(dish => <DishCard key={dish.id} {...dish} toggleLogin={toggleLogin} />);
  
  return (
    <>
      <Header toggleSignup={toggleSignup} toggleLogin={toggleLogin} showLogin={showLogin} showSignup={showSignup} showPopover={showPopover} setShowPopover={setShowPopover} />
      <div className={`app ${showSignup || showLogin ? 'blur' : ''}`} onClick={() => showPopover && setShowPopover(false)}>
        {loading ? (
          <HashLoader color={"#8CC25F"} loading={loading} size={50} style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}/>
        ) : (
          searchResults.length > 0 ? (
            <>
              <p className="results-title">We have found <span style={{color: "#8CC25F"}}>{dishElements.length} {dishElements.length === 1 ? 'dish' : 'dishes'}</span> matching your ingredients:</p>
              <div className="dishes">
                {dishElements}
              </div>
            </>
          ) : (
            <div className="error-nothing-found">
              <img src={errorHat} alt="error hat" />
              <div>
                <p style={{ fontWeight: 600, fontSize: "1.4rem", margin: 0 }}>Uh-oh! Looks like you've stumped our kitchen!</p>
                <p>We were looking high and low, but alas, our kitchen shelves are bare of recipes featuring those ingredients. Time to roll up your sleeves and craft your own culinary masterpiece!</p>
              </div>
            </div>
          )
        )}
      </div>
      {searchResults.length > 0 && <Pagination totalObjects={totalObjects} currentPage={(offset + 10) / 10}  onPageChange={handlePageChange} />}
      <Footer showLogin={showLogin} showSignup={showSignup} />
      <SignupModal showSignup={showSignup} toggleLogin={toggleLogin} onClose={toggleSignup} />
      <LoginModal showLogin={showLogin} toggleSignup={toggleSignup} onClose={toggleLogin} />
    </>
  );
}