import React, { useState, useEffect } from "react";
import HashLoader from "react-spinners/HashLoader";
import { useLocation, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from "axios";
import config from '../config';

import Header from "../components/Header";
import Pagination from "../components/Pagination";
import Footer from "../components/Footer";
import DishCard from "../components/DishCard";

import errorHat from '../images/error-hat.png';

export default function FavouritesPage({ showSignup, showLogin, toggleSignup, toggleLogin, showPopover, setShowPopover }) {
  const [favouriteDishes, setFavouriteDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingError, setFetchingError] = useState(false);
  const [cookies] = useCookies(['access']);
  const [offset, setOffset] = React.useState(0);
  const [isOffsetSet, setIsOffsetSet] = React.useState(false);
  const [totalObjects, setTotalObjects] = React.useState(0);
  const navigate = useNavigate();
  const location = useLocation();

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
      const getFavouriteDishes = async () => {
        try {
          await axios.get(`${config.serverUrl}/customer/favourites/?offset=${offset}`, {
            headers: { 'Authorization':  `Bearer ${cookies.access}` }
          })
            .then(response => {
              setFavouriteDishes(response.data.result);
              setTotalObjects(response.data.total);
            });
        } catch (error) {
          setFetchingError(true);
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
  
      getFavouriteDishes();
    }
  }, [offset, isOffsetSet]);

  const handlePageChange = (page) => {
    navigate(`?page=${page}`);
  };

  const renderFavouriteDishes = () => {
    if (fetchingError) {
      return (
        <div className="error-nothing-found">
          <img src={errorHat} alt="Error" />
          <div>
            <p className="error-nothing-found-header">Oops! Recipe Retrieval Error</p>
            <p>It seems we're experiencing some technical difficulties fetching your favorite dishes. Don't fret, though! Our team is on it, and we'll have those recipes ready for you in no time. Thanks for your patience!</p>
          </div>
        </div>
      );
    } else if (favouriteDishes.length === 0) {
      return (
        <div className="error-nothing-found">
          <img src={errorHat} alt="Error" />
          <div>
            <p className="error-nothing-found-header">Let's Find Some Favorites!</p>
            <p>It looks like you haven't added any favorite dishes yet. But don't worry, you can use the search field above to find some anytime.</p>
          </div>
        </div>
      );
    } else {
      return (
        <>
          <p className="results-title">You have <span style={{ color: "#8CC25F" }}>{favouriteDishes.length} {favouriteDishes.length === 1 ? 'dish' : 'dishes'}</span> in your favourites:</p>
          <div className="dishes">
            {favouriteDishes.map(dish => <DishCard key={dish.id} {...dish} toggleLogin={toggleLogin} />)}
          </div>
        </>
      );
    }
  };

  return (
    <>
      <Header toggleSignup={toggleSignup} toggleLogin={toggleLogin} showLogin={showLogin} showSignup={showSignup} showPopover={showPopover} setShowPopover={setShowPopover} />
      <div className={'app'} onClick={() => showPopover && setShowPopover(false)} >
        {loading ? (
          <HashLoader color={"#8CC25F"} loading={loading} size={50} style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}} />
        ) : renderFavouriteDishes()}
      </div>
      {favouriteDishes.length > 0 && <Pagination totalObjects={totalObjects} currentPage={(offset + 10) / 10}  onPageChange={handlePageChange} />}
      <Footer showLogin={showLogin} showSignup={showSignup} />
    </>
  );
}