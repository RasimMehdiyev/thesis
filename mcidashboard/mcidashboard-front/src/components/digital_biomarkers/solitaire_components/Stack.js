import React from 'react';
import Card from './Card';

const Stack = ({ cards, type, column }) => {
  return (
    <div className={`${type}-stack`}>
      {cards && cards.length > 0 && cards.map((card, index) => {
        if (type === 'build') {
          // In 'build', only the top card is face up
          return (
            <Card 
              key={card.id} 
              card={card} 
              isFaceUp={index === cards.length - 1} 
            />
          );
        } else if (type === 'talon') {
          // In 'talon', we show all cards face up
          const lastThree = cards.length - 3;
          return (
            <Card 
              key={card.id} 
              card={card} 
              isFaceUp={index >= lastThree} 
            />
          );
        } else if (type === 'draw') {
          // In 'draw', we only show the last 3 cards face up

          return (
            <Card 
              key={card.id} 
              card={card} 
              isFaceUp={false} 
            />
          );
        }
        return null; // default case
      })}
    </div>
  );
};

export default Stack;
