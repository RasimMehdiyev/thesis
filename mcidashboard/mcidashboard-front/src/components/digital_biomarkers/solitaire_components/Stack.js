import React from 'react';
import Card from './Card';

const Stack = ({ cards, type, isLastColumn, first_empty, card_touch, no_card_highlight, highlight_suit  }) => {

  return (
    <div className={`${type}-stack ${highlight_suit ? "highlight-destination" : ''}` }>
      
            
      {cards && cards.length > 0 && cards.map((card, index) => {

        if (type === 'build') {
          const isFaceUp = index === cards.length - 1 || (isLastColumn && index === cards.length - 2);
          return (
            <div key={card.id} className={`stack-slot`}>
              <Card
                card={card}
                isFaceUp={isFaceUp}
                first_empty={first_empty}
                card_touch={card_touch}
                no_card_highlight = {no_card_highlight}
              />
            </div>
          )
        } else if (type === 'talon') {
          const lastThree = cards.length - 3;
          console.log(index);
          
          return (
            <Card 
              key={card.id} 
              card={card} 
              isFaceUp={index >= lastThree} 
              no_card_highlight={no_card_highlight}
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
        return null; 
      })}
    </div>
  );
};

export default Stack;
