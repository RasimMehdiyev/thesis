import React, { useEffect, useState } from 'react';
import Stack from './solitaire_components/Stack';

const SolitaireAnimated = ({ cards }) => {
  const [buildDeck, setBuildDeck] = useState([]);
  const [pileDeck, setPileDeck] = useState([]);
    const [talon, setTalon] = useState([]);

  const splitDeck = (deck) => {
    const newDeck = [];
    let index = 0;

    // Loop to create 7 columns (stacks) incrementing in number of cards per stack
    for (let i = 1; i <= 7; i++) {
      const stack = deck.slice(index, index + i); // Get the next i cards from the deck
      stack.forEach((card, idx) => {
        card.isFaceUp = idx === stack.length - 1; // Only the top card should be face-up
      });
      newDeck.push(stack);
      index += i; // Move the index forward by the size of the stack
    }
    console.log(newDeck)
    setBuildDeck(newDeck);
    //3 cards for talon
    const indices = [1, 17,18]
    const talon = deck.slice(indices[0], indices[1]);
    talon.forEach((card) => (card.isFaceUp = true)); // All talon cards are face-up

    // The remaining cards are the pile deck
    const pile = deck.slice(index);
    // const pile = deck.slice(indices[1]);

    pile.forEach((card) => (card.isFaceUp = false)); // All pile cards are face-down
    setPileDeck(pile);
  };

  useEffect(() => {
    if (cards && cards.length === 52) {
      splitDeck(cards); // Split the deck when cards are available
    }
  }, [cards]);

  return (
    <div className="game-board">
      <div className="top-row">
        <div className="pile-talon">
                <Stack type="draw" cards={pileDeck}/>
                <Stack type="talon" cards={talon}/>
        </div>
        <div className="four-suits"></div>
      </div>
      <div className="bottom-row">
        {buildDeck.map((stack, index) => (
          <Stack key={index} type="build" cards={stack}/>
        ))}
      </div>
      <div className="game-info"></div>
    </div>
  );
};

export default SolitaireAnimated;
