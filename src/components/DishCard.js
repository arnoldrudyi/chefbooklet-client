import React from "react";
import { useCookies } from 'react-cookie';

import '../styles/DishCard.css';

export default function DishCard(props) {
  const [cookies] = useCookies(['access']);

  const textColors = {
    'easy': '#0DA100',
    'medium': '#E38800'
  };

  const levels = {
    'easy': 'Beginner',
    'medium': 'Medium',
    'moderate': 'Moderate',
    'hard': 'Advanced'
  };

  const countries = {
    'IT': 'Italian',
    'GL': 'Worldwide',
    'US': 'American',
    'HU': 'Hungarian',
    'UA': 'Ukrainian',
    'IE': 'Irish',
  };

  return (
    <div className="dish-card" onClick={() => cookies.access ? window.location.href=`/dish/${props.slug}` : props.toggleLogin(true)}>
      <div className="dish-img">
        <img src={props.image_url} alt={props.name}/>
      </div>
      <div className="dish-info">
        <p className="dish-name">{props.name}</p>
        <div className="dish-properties">
          <p style={{color: textColors[props.level]}}>
            <img src={require(`../images/difficulty-${props.level}.svg`)} alt={props.level} className="dish-difficulty-image"/>{levels[props.level]}
          </p>
          <p>
            <img src={require(`../images/flags/${props.nationality}-flag.png`)} alt={props.nationality} className="dish-country-image"/>{countries[props.nationality]}
          </p>
        </div>
      </div>
    </div>
  );
}