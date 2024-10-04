import React from 'react';
import Card from './Card';

const Stack = ({ cards, type, movingCard, emptySlot, isLastColumn }) => {
  return (
    <div className={`${type}-stack`}>
      {cards && cards.length > 0 && cards.map((card, index) => {
        const isMoving = movingCard && movingCard.id === card.id;

        if (type === 'build') {
          // Show only the last card face up except in the last column
          const isFaceUp = index === cards.length - 1 || (isLastColumn && index === cards.length - 2);
          
          return (
            <div key={card.id} className={`stack-slot ${emptySlot && index === cards.length - 1 ? 'empty-slot' : ''}`}>
              <Card
                card={card}
                isFaceUp={isFaceUp}
                className={isMoving ? 'moving-card' : ''}
              />
            </div>
          );
        } else if (type === 'talon') {
          const lastThree = cards.length - 3;
          return (
            <Card 
              key={card.id} 
              card={card} 
              isFaceUp={index >= lastThree} 
            />
          );
        } else if (type === 'draw') {
          return (
            <Card 
              key={card.id} 
              card={card} 
              isFaceUp={false} 
            />
          );
        } else if (type === 'four-suit') {
          return (
            <Card 
              key={card.id} 
              card={card} 
              isFaceUp={true} 
            />
          );
        }
        return null; // default case
      })}
      {/* Render an empty slot if the top card is being moved */}
      {emptySlot && <div className="empty-card-slot"></div>}
    </div>
  );
};

export default Stack;
