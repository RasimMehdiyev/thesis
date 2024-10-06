import React, { useEffect, useState } from 'react';
import Stack from './solitaire_components/Stack';

const SolitaireAnimated = ({ cards }) => {
  const [buildDeck, setBuildDeck] = useState([]);
  const [pileDeck, setPileDeck] = useState([]);
  const [talonDeck, setTalonDeck] = useState([]);
  const [fourSuits, setFourSuits] = useState([[], [], [], []]); // Empty slots for 4 suits
  const [movingCard, setMovingCard] = useState(null); // Store the moving card from build
  const [movingTalonCard, setMovingTalonCard] = useState(null); // Store the moving card from talon
  const [emptySlotIndex, setEmptySlotIndex] = useState(null); // Store the index of the empty slot after card moves
  const [movePhase, setMovePhase] = useState('build-to-last'); // Track the current move phase

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

  // Function to move the card based on the current move phase
  const moveCard = () => {
    if (movePhase === 'build-to-last') {
      // Move the card from the first build column to the last column
      setBuildDeck((prevBuildDeck) => {
        const firstColumn = [...prevBuildDeck[0]];
        const lastColumn = [...prevBuildDeck[6]];

        if (firstColumn.length > 0) {
          const cardToMove = firstColumn.pop();
          setMovingCard(cardToMove);
          setEmptySlotIndex(0); // Empty slot in the first column
          lastColumn.push(cardToMove);
        }

        return [
          [...firstColumn],
          ...prevBuildDeck.slice(1, 6),
          [...lastColumn],
        ];
      });

      // After the move, reset and switch to the next phase
      setTimeout(() => {
        setBuildDeck((prevBuildDeck) => {
          const firstColumn = [...prevBuildDeck[0]];
          const lastColumn = [...prevBuildDeck[6]];

          const cardToMove = lastColumn.pop();
          firstColumn.push(cardToMove);

          setMovingCard(null);
          setEmptySlotIndex(null); // Clear empty slot
          return [
            [...firstColumn],
            ...prevBuildDeck.slice(1, 6),
            [...lastColumn],
          ];
        });

        setMovePhase('talon-to-last');
      }, 2000);
    } else if (movePhase === 'talon-to-last') {
      // Move the top card from the talon pile to the last build column
      setTalonDeck((prevTalonDeck) => {
        const talonCopy = [...prevTalonDeck];
        if (talonCopy.length > 0) {
          const cardToMove = talonCopy.pop();
          setMovingTalonCard(cardToMove);

          setBuildDeck((prevBuildDeck) => {
            const lastColumn = [...prevBuildDeck[6]];
            lastColumn.push(cardToMove);
            return [
              ...prevBuildDeck.slice(0, 6),
              [...lastColumn],
            ];
          });

          // After moving, return the card back to the talon pile
          setTimeout(() => {
            setBuildDeck((prevBuildDeck) => {
              const lastColumn = [...prevBuildDeck[6]];
              const cardToMove = lastColumn.pop();
              talonCopy.push(cardToMove);
              setTalonDeck([...talonCopy]);

              setMovingTalonCard(null); // Clear the moving talon card
              setMovePhase('build-to-last'); // Switch back to the first phase
              return [
                ...prevBuildDeck.slice(0, 6),
                [...lastColumn],
              ];
            });
          }, 2000);
        }
        return talonCopy;
      });
    }
  };

  useEffect(() => {
    // Start the animation cycle after a delay
    const timer = setTimeout(moveCard, 2000);
    return () => clearTimeout(timer);
  }, [movePhase, buildDeck, talonDeck]);

  return (
    <div className="game-board">
      <div className="top-row">
        {/* Left side: pile and talon */}
        <div className="pile-talon">
          <Stack type="draw" cards={pileDeck} />
          <Stack type="talon" cards={talonDeck} movingCard={movingTalonCard} />
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
            emptySlot={index === emptySlotIndex} // Show empty slot where the card moved from
            isLastColumn={index === 6} // Pass true for the last column
          />
        ))}
      </div>
    </div>
  );
};

export default SolitaireAnimated;
