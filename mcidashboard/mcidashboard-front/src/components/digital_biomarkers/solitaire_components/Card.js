import React from 'react';

const Card = ({ card, isFaceUp, class_name }) => {
  // Get the public URL for the card images
  const solitaireImages = process.env.PUBLIC_URL + '/assets/solitaire_images/';

  return (
    <div className = {`${class_name}`}>
      {isFaceUp ? (
        <div className="card-game">
          <img
            className="card-image"
            src={solitaireImages + String(card.value) + card.suit + '.svg'}
            alt={`${card.value} of ${card.suit}`}
          />
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
