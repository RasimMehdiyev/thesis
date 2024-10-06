import React, { useEffect, useState } from 'react';
import Stack from './solitaire_components/Stack';

const SolitaireAnimated = ({ cards }) => {
  const [buildDeck, setBuildDeck] = useState([]);
  const [pileDeck, setPileDeck] = useState([]);
  const [talonDeck, setTalonDeck] = useState([]);
  const [fourSuits, setFourSuits] = useState([[], [], [], []]); // Empty slots for 4 suits

  const splitDeck = (deck) => {
    let buildDeck = [];
    let index = 0;
    for (let i = 1; i <= 7; i++) {
      buildDeck.push(deck.slice(index, index + i));
      index += i;
    }
    const talon = deck.slice(28, 31);
    const pile = deck.slice(31);
    return { buildDeck, talon, pile };
  };

  useEffect(() => {
    if (cards && cards.length === 52) {
      const { buildDeck, talon, pile } = splitDeck(cards);
      setBuildDeck(buildDeck);
      setTalonDeck(talon);
      setPileDeck(pile);
    }
  }, [cards]);

  return (
    <div className="game-board">
      <div className="top-row">
        {/* Left side: pile and talon */}
        <div className="pile-talon">
          <Stack type="draw" cards={pileDeck} />
          <Stack type="talon" cards={talonDeck} highlightTopCard = {true} /> {/* Highlight topmost talon card */}
        </div>

        {/* Right side: 4 empty slots for 4 suits */}
        <div className="four-suits">
          {fourSuits.map((suit, index) => (
            <Stack key={index} type="four-suit" cards={suit} />
          ))}
        </div>
      </div>

      {/* Build decks */}
      <div className="bottom-row">
        {buildDeck.map((stack, index) => (
          <Stack
            key={index}
            type="build"
            cards={stack}
            highlightLastCard={index === 0 || index === 6} // Highlight last card in first and last build column
          />
        ))}
      </div>
    </div>
  );
};

export default SolitaireAnimated;
