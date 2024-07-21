// TODO: make a settings.json file to parse API_URL and other sensitive data from there
// TODO: remove .then from all the requests

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HashLoader from "react-spinners/HashLoader";
import Aos from 'aos';
import config from '../config';

import Header from './Header';
import DishCard from './DishCard';
import Footer from './Footer';
import SignupModal from './SignupModal';
import LoginModal from './LoginModal';

import vegetables from '../images/veggies.png';
import searchBar from '../images/search-bar.png';
import cursor from '../images/cursor.png';
import dishGrid from '../images/dish-grid.png';
import paintedArrow from '../images/painted-arrow.png';
import salad from '../images/salad-art.png';
import '../styles/HomePage.css';

export default function HomePage({ showSignup, showLogin, toggleSignup, toggleLogin, showPopover, setShowPopover }) {
  const [nationality, setNationality] = useState('italian');
  const [randomDishes, setRandomDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  Aos.init();

  useEffect(() => {
    const getRandomDishes = async() => {
      try {
        const response = await axios.get(`${config.serverUrl}/dish/random/?amount=4`);
        setRandomDishes(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getRandomDishes();
  }, []);

  const randomDishesElements = randomDishes.map(dish => <DishCard key={dish.id} {...dish} toggleLogin={toggleLogin}/>);

  return (
    <>
      <Header toggleLogin={toggleLogin} toggleSignup={toggleSignup} showLogin={showLogin} showSignup={showSignup} showPopover={showPopover} setShowPopover={setShowPopover} />
      <div className={`app ${showSignup || showLogin ? 'blur' : ''}`} onClick={() => showPopover && setShowPopover(false)}>
        <div className='app-banner'>
          <div className='banner-text'>
            <h1>Don't know what to cook?</h1>
            <p>Just type the list of ingredients you have in the field above and we will find the appropriate recipe for you.</p>
          </div>
          <img src={vegetables} alt='vegetables'/>
        </div>
        <h1 className='app-section-header' style={{paddingTop: "min(70px, 4%)"}}>Some <span style={{color: "#8CC25F"}}>random</span> dishes you may like</h1>
        <div className='app-random-dishes' style={loading ? {display: "flex"} : {}}>
          {loading ? <HashLoader color={"#8CC25F"} loading={loading} size={50}/> : randomDishesElements}
        </div>
        <h1 className='app-section-header' id="manual">Where Ingredients <span style={{color: "#8CC25F"}}>Inspire</span> Delicious Creations</h1>
        <div className='app-manual-cards'>
          <div className='manual-card'>
            <div className='manual-card-img-wrapper'>
              <div className='manual-card-img' style={{position: "relative", display: "flex", justifyContent: "center"}}>
                <img src={searchBar} alt='search-bar' style={{width: "95%"}}/>
                <img src={cursor} alt='cursor' style={{width: "6.5%", position: "absolute", transform: "translateX(42px) translateY(27px)"}}/>
              </div>
            </div>
            <div className='manual-card-text'>
              <h2>Enter your ingredients</h2>
              <p>Start by listing the ingredients you have on hand. Whether it's a handful of basics or a well-stocked pantry, simply input what you've got, and let our recipe wizard do the rest.</p>
            </div>
          </div>
          <img src={paintedArrow} className='manual-divider' style={{bottom: "0", transform: "translateX(-235px) translateY(-20px)"}} alt='arrow-divider'/>
          <div className='manual-card'>
            <div className='manual-card-img-wrapper' style={{position: "relative"}}>
              <div className='manual-card-img' style={{position: "relative", display: "flex", justifyContent: "center"}}>
                <img src={dishGrid} alt='dish-grid' style={{width: "100%"}}/>
                <img src={cursor} alt='cursor' style={{width: "4.5%", position: "absolute", transform: "translateX(-30px) translateY(39px)"}}/>
              </div>
            </div>
            <div className='manual-card-text'>
              <h2>Pick up an appropriate dish</h2>
              <p>Browse through our collection of mouthwatering dishes. Our intuitive search algorithm will recommend recipes that match your ingredients, so you can choose the perfect meal for your cravings.</p>
            </div>
          </div>
          <img src={paintedArrow} className='manual-divider' style={{top: "0", transform: "rotate(180deg) scaleX(-1) translateX(235px) translateY(14px)"}} alt='arrow-divider'/>
          <div className='manual-card'>
            <div className='manual-card-img-wrapper' style={{position: "relative"}}>
              <div className='manual-card-img' style={{position: "relative", display: "flex", justifyContent: "center"}}>
                <img src={salad} alt='salad' style={{width: "67%"}}/>
              </div>
            </div>
            <div className='manual-card-text'>
              <h2>Cook your delicious creation</h2>
              <p>With your chosen recipe in hand, it's time to put on your chef's hat. Follow the step-by-step instructions, and watch as your ingredients transform into a delicious masterpiece. Cooking has never been this easy or satisfying!</p>
            </div>
          </div>
        </div>
        <h1 className='app-section-header'>Discover <span style={{color: "#8CC25F"}}>Global</span> Tastes United</h1>
        <div className='app-countries'>
          <div className='countries-preview'>
            <img src={require(`../images/dishes-${nationality}.png`)} onClick={() => window.location.href = `/dish/nationality/${nationality}`} alt='national-cuisine' />
          </div>
          <div className='countries-toggler'>
            <button className={nationality === 'italian' && 'selected'} onClick={() => setNationality('italian')}><img src={require('../images/flags/IT-flag.png')} alt='italian-cuisine' />Italian</button>
            <button className={nationality === 'american' && 'selected'} onClick={() => setNationality('american')}><img src={require('../images/flags/US-flag.png')} alt='american-cuisine' />American</button>
            <button className={nationality === 'ukrainian' && 'selected'} onClick={() => setNationality('ukrainian')}><img src={require('../images/flags/UA-flag.png')} alt='ukrainian-cuisine' />Ukrainian</button>
            <button className={nationality === 'hungarian' && 'selected'} onClick={() => setNationality('hungarian')}><img src={require('../images/flags/HU-flag.png')} alt='japanese-cuisine' />Hungarian</button>
            <button className={nationality === 'worldwide' && 'selected'} onClick={() => setNationality('worldwide')} style={{gridColumn: "span 4", marginTop: "13px"}}><img src={require('../images/flags/GL-flag.png')} alt='worldwide-cuisine' />Worldwide</button>
          </div>
        </div>
      </div>
      <Footer showLogin={showLogin} showSignup={showSignup} />
      <SignupModal showSignup={showSignup} toggleLogin={toggleLogin} onClose={toggleSignup} />
      <LoginModal showLogin={showLogin} toggleSignup={toggleSignup} onClose={toggleLogin} />
    </>
  );
}
