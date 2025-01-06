import React from 'react';
import { useState } from 'react';
import Tooltip from '../../TooltipSolitaire'; 

const Card = ({ card, isFaceUp, first_empty, card_touch, no_card_highlight, highlight_suit }) => {
  const solitaireImages = process.env.PUBLIC_URL + '/static/assets/solitaire_images/';
  const [isHovered, setIsHovered] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  console.log(card);
    const showTooltip = () => {
      setIsTooltipVisible(true);
    };
  
    const hideTooltip = () => {
      setIsTooltipVisible(false);
    };
  return (
    <div
      className="card-container"
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
    >
      {isFaceUp ? (
        <div className={`card-game border-none-class ${card.highlight && !card.destination && !no_card_highlight ? 'highlight': ''} ${card_touch && card.id === 2 ? 'card-touch' : ''} ${card.destination && !no_card_highlight ? 'highlight-destination' : ''} `}>
          
          {
          first_empty && card.id === 2 ? 
            <div> 
            <div 
              className={`card-image four-suit-stack highlight-destination`}             
              onMouseEnter={showTooltip}  
              onMouseLeave={hideTooltip} 
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
            onMouseEnter={showTooltip}  
            onMouseLeave={hideTooltip} 
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
    </div>
  );
};

export default Card;
