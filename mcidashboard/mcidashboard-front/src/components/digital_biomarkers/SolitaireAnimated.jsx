import React, { useEffect, useState } from 'react';
import Stack from './solitaire_components/Stack';
import Tooltip from '../TooltipSolitaire'; // Import tooltip
const SolitaireAnimated = ({ cards, highlight_suit, first_empty, card_touch, no_card_highlight }) => {
  const [buildDeck, setBuildDeck] = useState([]);
  const [pileDeck, setPileDeck] = useState([]);
  const [talonDeck, setTalonDeck] = useState([]);
  const [fourSuits, setFourSuits] = useState([[], [], [], []]); // Empty slots for 4 suits
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [highlightState, setHighlightState] = useState(false);
  // Show tooltip on mouse enter
  const showTooltip = () => {
    setIsTooltipVisible(true);
  };

  // Hide tooltip on mouse leave
  const hideTooltip = () => {
    setIsTooltipVisible(false);
  };

console.log(highlight_suit);
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
      setHighlightState(highlight_suit);
    }

  }, [cards]);

  return (
    <div className='game-board-container'>
      <div className='game-board-sidebar'>
        <img src={process.env.PUBLIC_URL + "/assets/search_icon.svg"} alt="" />
        <img src={process.env.PUBLIC_URL + "/assets/burger-bar.svg"} className="highlight-icon" alt="" />
        <img src={process.env.PUBLIC_URL + "/assets/undo.svg"} alt="" className='highlight-icon'/>
      </div>
      <div className="game-board">
      <div className="top-row">
        <div className="pile-talon">
          <Stack type="draw" cards={pileDeck}/>
          <Stack type="talon" cards={talonDeck} highlightTopCard = {true} no_card_highlight={no_card_highlight} />
        </div>

        <div 
          className={`four-suits`}
          onMouseEnter={showTooltip} 
          onMouseLeave={hideTooltip} 
        >
          {fourSuits.map((suit, index) =>   (
            <Stack 
            key={index} 
            type="four-suit" cards={suit} highlight_suit={highlight_suit}  />
          ))}
           { highlight_suit ? (         
            <Tooltip
            
            content={"Player should put one of the 4 cards into the empty slot to avoid the Ace β error"}
            isVisible={isTooltipVisible}
            right={600}
            top={'auto'}
            left={'auto'}
            width={'350px'}
            maxWidth={'350px'}

          />)
          : 
          null}  
        </div>
      </div>

      <div className="bottom-row">
        {buildDeck.map((stack, index) => (
          <Stack
            key={index}
            type="build"
            cards={stack}
            first_empty={first_empty}
            index={index}
            card_touch={card_touch}
            highlightLastCard={index === 0 || index === 6}
            no_card_highlight = {no_card_highlight}
          />
        ))}
      </div>
    </div>
    </div>
    
  );
};

export default SolitaireAnimated;
