import React from 'react';
// useState
import { useState } from 'react';
// import tooltip
import Tooltip from '../../TooltipSolitaire'; 


const Card = ({ card, isFaceUp, index }) => {
  const solitaireImages = process.env.PUBLIC_URL + '/assets/solitaire_images/';
  console.log(index);
  const [isHovered, setIsHovered] = useState(false); // To track hover state
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
    // Show tooltip on mouse enter
    const showTooltip = () => {
      setIsTooltipVisible(true);
    };
  
    // Hide tooltip on mouse leave
    const hideTooltip = () => {
      setIsTooltipVisible(false);
    };
  return (
    <div
      className="card-container"
      onMouseEnter={() => setIsHovered(true)} // Set hover state to true
      onMouseLeave={() => setIsHovered(false)} // Set hover state to false
    >
      {isFaceUp ? (
        <div className={`card-game ${card.highlight && !card.destination ? 'highlight': ''} ${card.destination ? 'highlight-destination' : ''}`}>
          <img
            className="card-image"
            src={solitaireImages + String(card.value) + card.suit + '.svg'}
            alt={`${card.value} of ${card.suit}`}
            onMouseEnter={showTooltip}  // Show tooltip on hover
            onMouseLeave={hideTooltip} // Hide tooltip when hover ends
          />
          { card.message && isFaceUp ? (         <Tooltip
            content={card.message}
            isVisible={isTooltipVisible}
            left={-150}
            top={0}
            onMouseEnter={showTooltip}  // Show tooltip on hover
            onMouseLeave={hideTooltip} // Hide tooltip when hover ends
          />)
          : 
          null}  
        </div>
      ) : (
        <div className="card-game">
          <img className="card-image" src={solitaireImages + '2B.svg'} alt="Card Back" />
        </div>
      )}

      {/* Display message on hover */}
      {/* {isHovered && isFaceUp && card.message && (
        <div className="hover-message">
          {card.message}
        </div>
      )} */}
    </div>
  );
};

export default Card;
