import React from 'react';
// useState
import { useState } from 'react';
// import tooltip
import Tooltip from '../../TooltipSolitaire'; 

const Card = ({ card, isFaceUp, first_empty, card_touch, no_card_highlight, highlight_suit }) => {
  const solitaireImages = process.env.PUBLIC_URL + '/static/assets/solitaire_images/';
  const [isHovered, setIsHovered] = useState(false); // To track hover state
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  console.log(card);
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
        <div className={`card-game border-none-class ${card.highlight && !card.destination && !no_card_highlight ? 'highlight': ''} ${card_touch && card.id === 2 ? 'card-touch' : ''} ${card.destination && !no_card_highlight ? 'highlight-destination' : ''} `}>
          
          {
          first_empty && card.id === 2 ? 
            <div> 
            <div 
              className={`card-image four-suit-stack highlight-destination`}             
              onMouseEnter={showTooltip}  // Show tooltip on hover
              onMouseLeave={hideTooltip} // Hide tooltip when hover ends
            > 
            </div> 
                <Tooltip
              
              content={"Destination for the K❤."}
              isVisible={isTooltipVisible}
              left={-150}
              top={0}
            />
            </div>

            :
            <img
            className="card-image"
            src={solitaireImages + String(card.value) + card.suit + '.svg'}
            alt={`${card.value} of ${card.suit}`}
            onMouseEnter={showTooltip}  // Show tooltip on hover
            onMouseLeave={hideTooltip} // Hide tooltip when hover ends
          />}

          { card.message && isFaceUp ? (         
            <Tooltip
            
            content={card.message}
            isVisible={isTooltipVisible}
            left={-180}
            top={0}
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
