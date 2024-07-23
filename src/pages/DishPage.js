import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import HashLoader from "react-spinners/HashLoader";
import { useCookies } from 'react-cookie';
import config from '../config';

import Header from "../components/Header";
import Footer from "../components/Footer";
import SignupModal from "../components/SignupModal";
import LoginModal from "../components/LoginModal";

import errorHat from '../images/error-hat.png';
import starIconActive from '../images/star-icon-active.svg';
import starIcon from '../images/star-icon-inactive.svg';
import '../styles/DishPage.css';

export default function DishPage({ showSignup, showLogin, toggleSignup, toggleLogin, showPopover, setShowPopover }) {
  const { dishSlug } = useParams();
  const [dishData, setDishData] = useState({});
  const [loading, setLoading] = useState(true);
  const [cookies] = useCookies(['access']);

  useEffect(() => {
    const getDishData = async () => {
      try {
        await axios.get(`${config.serverUrl}/dish/get/${dishSlug}`, {
          headers: { 'Authorization':  `Bearer ${cookies.access}` }
        })
          .then(response => {
            setDishData(response.data.dish);
          });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getDishData();
  }, []);

  const toggleFavourite = async () => {
    try {
        const url = dishData.is_favourite
          ? `${config.serverUrl}/customer/favourites/?dish_id=${dishData.id}`
          : `${config.serverUrl}/customer/favourites/`;
        const method = dishData.is_favourite ? 'delete' : 'post';

        await axios({
          method: method,
          url: url,
          headers: {
            'Authorization': `Bearer ${cookies.access}`
          },
          data: dishData.is_favourite ? null : { 'dish_id': dishData.id }
        });

        setDishData(prevData => ({ ...prevData, 'is_favourite': !prevData.is_favourite }));
      } catch (error) {
        console.log(error);
    }
  };

  return (
    <>
      <Header toggleSignup={toggleSignup} toggleLogin={toggleLogin} showLogin={showLogin} showSignup={showSignup} showPopover={showPopover} setShowPopover={setShowPopover} />
      <div className={`app ${showSignup || showLogin ? 'blur' : ''}`} onClick={() => showPopover && setShowPopover(false)} >
        {loading ? (
          <HashLoader color={"#8CC25F"} loading={loading} size={50} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
        ) : (
          Object.keys(dishData).length ? (
            <>
              <div className="dish-wrapper">
                <img className="dish-wrapper-main-image" src={dishData.image_url} alt={dishData.name} />
                <div className="dish-page-info">
                  <div className="dish-page-info-title">
                    <h2>{dishData.name}</h2>
                    <img className="favourite-button" src={dishData.is_favourite ? starIconActive : starIcon} alt="Favourite" onClick={toggleFavourite} />
                  </div>
                  <div className="dish-page-info-ingredients">
                    <p className="dish-page-info-section-header">Ingredients <span className="dish-page-info-section-header-line"></span></p>
                    <ul>
                      {dishData.ingredients.map((ingredient, index) => (
                        <li key={index} className={ingredient.mandatory ? 'mandatory' : ''}>
                          <span className="ingredient-content">
                            <span>{ingredient.name.charAt(0).toUpperCase() + ingredient.name.slice(1)}</span>
                            <span style={{ fontWeight: 500 }}>{ingredient.quantity} {ingredient.unit}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="dish-page-info-sequence">
                    <p className="dish-page-info-section-header">Sequence <span className="dish-page-info-section-header-line"></span></p>
                    <ol>
                      {dishData.sequence.map((action, index) => <li key={index}>{action}</li>)}
                    </ol>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="error-nothing-found">
              <img src={errorHat} alt="Error" />
              <div>
                <p className="error-nothing-found-header">Whoops! Looks like you took a wrong turn in the recipe book.</p>
                <p>It seems you've entered uncharted culinary territory — this dish page is nowhere to be found!</p>
              </div>
            </div>
          )
        )}
      </div>
      <Footer showLogin={showLogin} showSignup={showSignup} />
      <SignupModal showSignup={showSignup} toggleLogin={toggleLogin} onClose={toggleSignup} />
      <LoginModal showLogin={showLogin} toggleSignup={toggleSignup} onClose={toggleLogin} />
    </>
  );
}