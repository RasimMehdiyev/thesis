import React, { useEffect, useState } from 'react';
import Stack from './solitaire_components/Stack';

const SolitaireAnimated = ({ cards }) => {
  const [buildDeck, setBuildDeck] = useState([]);
  const [pileDeck, setPileDeck] = useState([]);
  const [talonDeck, setTalonDeck] = useState([]);
  const [fourSuits, setFourSuits] = useState([[], [], [], []]); // Empty slots for 4 suits
  const [movingCard, setMovingCard] = useState(null); // Store the moving card
  const [emptySlotIndex, setEmptySlotIndex] = useState(null); // Store the index of the empty slot after card moves
  const [moveToLast, setMoveToLast] = useState(true); // Track direction of movement

  const splitDeck = (deck) => {
    // Split build cards (first 28 cards go to the build deck)
    let buildDeck = [];
    let index = 0;
    for (let i = 1; i <= 7; i++) {
      buildDeck.push(deck.slice(index, index + i));
      index += i;
    }

    // Talon (next 3 cards)
    const talon = deck.slice(28, 31);

    // Pile (remaining cards)
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

  // Function to move the top card from one column to another (back and forth)
  const moveCardBackAndForth = () => {
    setBuildDeck((prevBuildDeck) => {
      const firstColumn = [...prevBuildDeck[0]]; // Copy the first column
      const lastColumn = [...prevBuildDeck[6]];  // Copy the last column

      if (moveToLast && firstColumn.length > 0) {
        // Move from first column to last
        const cardToMove = firstColumn.pop();
        setMovingCard(cardToMove);
        setEmptySlotIndex(0);
        lastColumn.push(cardToMove);
      } else if (!moveToLast && lastColumn.length > 0) {
        // Move back from last column to first
        const cardToMove = lastColumn.pop();
        setMovingCard(cardToMove);
        setEmptySlotIndex(6);
        firstColumn.push(cardToMove);
      }

      // Return updated deck
      return [
        [...firstColumn],
        ...prevBuildDeck.slice(1, 6),
        [...lastColumn],
      ];
    });

    // Toggle the direction of movement
    setMoveToLast((prev) => !prev);

    // After the animation ends, clear the moving card
    setTimeout(() => {
      setMovingCard(null);
      setEmptySlotIndex(null); // Clear the empty slot after the card moves
    }, 2000); // Adjust the timeout duration for smooth movement
  };

  useEffect(() => {
    // Automatically move the card after 2 seconds (to see the transition)
    const timer = setTimeout(moveCardBackAndForth, 2000);
    return () => clearTimeout(timer);
  }, [buildDeck]);

  return (
    <div className="game-board">
      <div className="top-row">
        {/* Left side: pile and talon */}
        <div className="pile-talon">
          <Stack type="draw" cards={pileDeck} />
          <Stack type="talon" cards={talonDeck} />
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
            movingCard={movingCard} 
            emptySlot={emptySlotIndex === index} // Show empty slot in first or last column
            isLastColumn={index === 6} // Pass true for the last column
          />
        ))}
      </div>
    </div>
  );
};

export default SolitaireAnimated;
