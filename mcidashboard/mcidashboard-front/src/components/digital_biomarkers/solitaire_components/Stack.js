import React from 'react';
import Card from './Card';

const Stack = ({ cards, type, emptySlot, isLastColumn  }) => {
  return (
    <div className={`${type}-stack`}>
      {cards && cards.length > 0 && cards.map((card, index) => {

        if (type === 'build') {
          // Highlight the last card in the first and last build columns
          const isFaceUp = index === cards.length - 1 || (isLastColumn && index === cards.length - 2);
          
          return (
            <div key={card.id} className={`stack-slot ${emptySlot && index === cards.length ? 'empty-slot' : ''}`}>
              <Card
                card={card}
                isFaceUp={isFaceUp}
              />
            </div>
          );
        } else if (type === 'talon') {
          // Highlight the top card of the talon (the last three cards)
          const lastThree = cards.length - 3;
          console.log(index);
          
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
        return null; // Default case
      })}
    </div>
  );
};

export default Stack;
