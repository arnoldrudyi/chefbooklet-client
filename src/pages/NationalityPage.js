import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import HashLoader from "react-spinners/HashLoader";
import config from '../config';

import Header from "../components/Header";
import Pagination from "../components/Pagination";
import Footer from "../components/Footer";
import SignupModal from "../components/SignupModal";
import LoginModal from "../components/LoginModal";
import DishCard from "../components/DishCard";

import errorHat from '../images/error-hat.png';


export default function NationalityPage({ showSignup, showLogin, toggleSignup, toggleLogin, showPopover, setShowPopover }) {
  const { dishNationality } = useParams();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = React.useState(true);
  const [offset, setOffset] = React.useState(0);
  const [isOffsetSet, setIsOffsetSet] = React.useState(false);
  const [totalObjects, setTotalObjects] = React.useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  
  const countries = {
    'italian': 'IT',
    'worldwide': 'GL',
    'american': 'US',
    'hungarian': 'HU',
    'ukrainian': 'UA',
    'irish': 'IE',
  };

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
      const getDishesByNationality = async () => {
        try {
          await axios.get(`${config.serverUrl}/dish/nationality/${countries[dishNationality]}/?offset=${offset}`)
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
  
      getDishesByNationality();
    }
  }, [offset, isOffsetSet]);

  const handlePageChange = (page) => {
    navigate(`?page=${page}`);
  };

  const dishElements = searchResults.map(dish => <DishCard key={dish.id} {...dish} toggleLogin={toggleLogin} />);

  return (
    <>
      <Header toggleLogin={toggleLogin} toggleSignup={toggleSignup} showLogin={showLogin} showSignup={showSignup} showPopover={showPopover} setShowPopover={setShowPopover} />
      <div className={`app ${showSignup || showLogin ? 'blur' : ''}`} onClick={() => showPopover && setShowPopover(false)}>
        {loading ? (
          <HashLoader color={"#8CC25F"} loading={loading} size={50} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}/>
        ) : (
          searchResults.length > 0 ? (
            <>
              <p className="results-title" style={{ display: "flex", justifyContent: "center", alignItems: 'center', columnGap: "10px" }}>
                Culinary Wonders of {dishNationality.charAt(0).toUpperCase() + dishNationality.slice(1)} Cuisine <img src={require(`../images/flags/${countries[dishNationality]}-flag.png`)} alt={dishNationality} />
              </p>
              <div className="dishes">
                {dishElements}
              </div>
            </>
          ) : (
            <div className="error-nothing-found">
              <img src={errorHat} alt="error hat" />
              <div>
                <p className="error-nothing-found-header">Sorry, it seems like this culinary adventure hit a snag.</p>
                <p>The flavors of {dishNationality.charAt(0).toUpperCase() + dishNationality.slice(1)} cuisine are currently unavailable. It might be time to explore another delicious destination on our menu!</p>
              </div>
            </div>
          )
        )}
      </div>
      {searchResults.length > 0 && <Pagination totalObjects={totalObjects} currentPage={(offset + 10) / 10}  onPageChange={handlePageChange} />}
      <Footer toggleLogin={toggleLogin} toggleSignup={toggleSignup} showLogin={showLogin} showSignup={showSignup} />
      <SignupModal showSignup={showSignup} toggleLogin={toggleLogin} onClose={toggleSignup} />
      <LoginModal showLogin={showLogin} toggleSignup={toggleSignup} onClose={toggleLogin} />
    </>
  );
}