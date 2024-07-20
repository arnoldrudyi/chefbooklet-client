import React, { useEffect, useState } from "react";
import AOS from 'aos';
import axios from "axios";
import config from '../config';

import 'aos/dist/aos.css';
import '../styles/SearchSuggestions.css';

export default function SearchSuggestions({ query, setChosen }) {
  const [searchSuggestions, setSearchSuggestions] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 500 });
  }, []);

  useEffect(() => {
    const getSuggestions = async () => {
      if (!query.inputData) return;
      try {
        await axios.get(`${config.serverUrl}/ingredient/?q=${query.inputData}`)
          .then(response => {
            setSearchSuggestions(response.data.ingredients);
          });
      } catch (error) {
        console.error(error);
      }
    };
    
    getSuggestions();
  }, [query.inputData]);

  const handleSelect = (ingredientName) => {
    setSearchSuggestions([]);
    setChosen(ingredientName.toLowerCase());
  };

  const filteredSuggestions = searchSuggestions.filter(
    ingredientName => !query.chosenIngredients.includes(ingredientName.toLowerCase())
  );
  
  if (!filteredSuggestions.length || !query.inputData) {
    return null;
  }

  return (
    <div className="suggestions" data-aos="zoom-out">
      {filteredSuggestions.map((ingredientName) => (
        <span
          key={ingredientName}
          className="suggestion-item"
          data-aos="fade-up"
          onClick={() => handleSelect(ingredientName)}
        >
          {ingredientName.charAt(0).toUpperCase() + ingredientName.slice(1)}
        </span>
      ))}
    </div>
  );
};