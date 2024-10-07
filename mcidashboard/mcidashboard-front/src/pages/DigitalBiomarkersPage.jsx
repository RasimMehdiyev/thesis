import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Tooltip from '../components/Tooltip'; 
import CategorizedBiomarker from '../components/digital_biomarkers/CategorizedBiomarkers';
import SolitaireAnimated from '../components/digital_biomarkers/SolitaireAnimated';
const DigitalBiomarkersPage = () => {

//  fetch all digital biomarkers
    const [biomarkers, setBiomarkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cards, setCards] = useState([]);
    const[cards2, setCards2] = useState([]);
    const[cards3, setCards3] = useState([]);
    const [cards4, setCards4] = useState([]);
    const [cards5, setCards5] = useState([]);

    useEffect(() => {
        console.log('Component mounted, fetching biomarkers...');
        fetchBiomarkers();
        fetchFromJsonFile();
    }, []);  // Empty dependency array ensures it only runs once on mount

    const [isTooltipVisible, setIsTooltipVisible] = useState(false);

    // Show tooltip on mouse enter
    const showTooltip = () => {
      setIsTooltipVisible(true);
    };
  
    // Hide tooltip on mouse leave
    const hideTooltip = () => {
      setIsTooltipVisible(false);
    };
    
    const fetchFromJsonFile = async () => {
        try {
          // Try fetching from /static/ first
          const response = await fetch('/static/deck.json');
          const data = await response.json();
          setCards(data);
        } catch (error) {
          console.error("Error fetching deck.json from /static/, trying fallback path", error);
          try {
            // Fallback to the root path if the first fails
            const response = await fetch('/deck.json');
            const data = await response.json();
            setCards(data);
          } catch (fallbackError) {
            console.error("Failed to fetch deck.json from both paths", fallbackError);
          }
        }
      
        // Repeat the same logic for deck-1.json, deck-2.json, and deck-3.json
        try {
          const response2 = await fetch('/static/deck-1.json');
          const data2 = await response2.json();
          setCards2(data2);
        } catch (error) {
          console.error("Error fetching deck-1.json from /static/, trying fallback path", error);
          try {
            const response2 = await fetch('/deck-1.json');
            const data2 = await response2.json();
            setCards2(data2);
          } catch (fallbackError) {
            console.error("Failed to fetch deck-1.json from both paths", fallbackError);
          }
        }
      
        try {
          const response3 = await fetch('/static/deck-2.json');
          const data3 = await response3.json();
          setCards3(data3);
        } catch (error) {
          console.error("Error fetching deck-2.json from /static/, trying fallback path", error);
          try {
            const response3 = await fetch('/deck-2.json');
            const data3 = await response3.json();
            setCards3(data3);
          } catch (fallbackError) {
            console.error("Failed to fetch deck-2.json from both paths", fallbackError);
          }

          try{
            const response5 = await fetch('/static/deck-icon.json');
            const data5 = await response5.json();
            setCards5(data5);
          }
            catch (error) {
                console.error("Error fetching deck-4.json from /static/, trying fallback path", error);
                try {
                    const response5 = await fetch('/deck-icon.json');
                    const data5 = await response5.json();
                    setCards5(data5);
                } catch (fallbackError) {
                    console.error("Failed to fetch deck-4.json from both paths", fallbackError);
                }
                }

        }
      
        try {
          const response4 = await fetch('/static/deck-3.json');
          const data4 = await response4.json();
          setCards4(data4);
        } catch (error) {
          console.error("Error fetching deck-3.json from /static/, trying fallback path", error);
          try {
            const response4 = await fetch('/deck-3.json');
            const data4 = await response4.json();
            setCards4(data4);
          } catch (fallbackError) {
            console.error("Failed to fetch deck-3.json from both paths", fallbackError);
          }
        }
      };
      

    const fetchBiomarkers = async () => {
        console.log('Attempting to fetch biomarkers...');
        try {
            const response = await fetch('/dashboard/biomarkers_type/');
            console.log('Response status:', response.status);
            
            const data = await response.json();
            console.log('Fetched Data:', data);
    
            if (data) {
                setBiomarkers(data);
                console.log('Biomarkers state updated:', data);
            } else {
                console.error('No biomarkers data found in the response.');
            }
        } catch (error) {
            console.error('Error fetching biomarkers:', error);
        } finally {
            setLoading(false);
        }
    }
    
    const data = [
        {
            "id": 1,
            "biomarkers": [
                {
                    "id": 19,
                    "name": "Game Time",
                    "unit": "milliseconds",
                    "type": 1
                },
                {
                    "id": 20,
                    "name": "Score",
                    "unit": "points",
                    "type": 1
                },
                {
                    "id": 21,
                    "name": "Solved",
                    "unit": "boolean (true/false)",
                    "type": 1
                }
            ],
            "name": "Result-based",
            "description": null
        },
        {
            "id": 2,
            "biomarkers": [
                {
                    "id": 1,
                    "name": "Total Time Average",
                    "unit": "milliseconds",
                    "type": 2
                },
                {
                    "id": 2,
                    "name": "Total Time SD",
                    "unit": "milliseconds",
                    "type": 2
                },
                {
                    "id": 3,
                    "name": "Think Time Average",
                    "unit": "milliseconds",
                    "type": 2
                },
                {
                    "id": 4,
                    "name": "Think Time SD",
                    "unit": "milliseconds",
                    "type": 2
                },
                {
                    "id": 5,
                    "name": "Move Time Average",
                    "unit": "milliseconds",
                    "type": 2
                },
                {
                    "id": 6,
                    "name": "Move Time SD",
                    "unit": "milliseconds",
                    "type": 2
                },
                {
                    "id": 22,
                    "name": "Total Time Min",
                    "unit": "milliseconds",
                    "type": 2
                },
                {
                    "id": 23,
                    "name": "Think Time Min",
                    "unit": "milliseconds",
                    "type": 2
                },
                {
                    "id": 24,
                    "name": "Move Time Min",
                    "unit": "milliseconds",
                    "type": 2
                }
            ],
            "name": "Time-based",
            "description": null
        },
        {
            "id": 3,
            "biomarkers": [
                {
                    "id": 7,
                    "name": "Pile Move",
                    "unit": "percentage (0% - 100%)",
                    "type": 3
                },
                {
                    "id": 8,
                    "name": "King Beta Error",
                    "unit": "percentage (0% - 100%)",
                    "type": 3
                },
                {
                    "id": 9,
                    "name": "Ace Beta Error",
                    "unit": "percentage (0% - 100%)",
                    "type": 3
                },
                {
                    "id": 10,
                    "name": "Beta Error",
                    "unit": "percentage (0% - 100%)",
                    "type": 3
                },
                {
                    "id": 11,
                    "name": "Final Beta Error",
                    "unit": "boolean (true/false)",
                    "type": 3
                }
            ],
            "name": "Performance-based",
            "description": null
        }
    ]

  return (
    <div className='container' id="biomarker-container">
        <div class="biomarkers-list">
            <div className='personal-info-h' style={{ position: 'relative' }}>
                <p className='ml-subtitle'>Digital biomarkers grouped by category</p>
            <img
                src='/assets/info_icon.svg'
                alt='Info Icon'
                className='icon'
                onMouseEnter={showTooltip}  // Show tooltip on hover
                onMouseLeave={hideTooltip}  // Hide tooltip when hover ends
                style={{ cursor: 'pointer', marginTop: 5 }}
            />

            <Tooltip
                content="Out of the 61 markers, only <strong>26</strong> were used in the machine learning models because some were too similar or not useful. By focusing on the most important ones, the models can make better predictions without being confused by redundant data."
                isVisible={isTooltipVisible}
                left={100}
                top={-20}
            />
            </div>
            {
                biomarkers.map(biomarker_type => (
                    <CategorizedBiomarker key={biomarker_type.id} biomarker_type={biomarker_type}/>
                ))
            }
        </div>
        <div className='solitaire-animated'>
            {/* <SolitaireAnimated highlight_suit={true} cards = {cards2} first_empty = {true} card_touch = {false}/> */}
            <SolitaireAnimated highlight_suit={false} cards = {cards5} first_empty = {false} card_touch = {false} no_card_highlight = {true} movingIcons = {true}/>
            <SolitaireAnimated highlight_suit={false} cards = {cards} first_empty = {false} card_touch = {false} no_card_highlight = {false} movingIcons = {false}/>
            <SolitaireAnimated highlight_suit={true} cards = {cards2} first_empty = {false} card_touch = {false} no_card_highlight = {false} movingIcons = {false}/>
            <SolitaireAnimated highlight_suit={false} cards = {cards3} first_empty = {true} card_touch = {false} no_card_highlight = {false} movingIcons = {false}/>
            <SolitaireAnimated highlight_suit={false} cards = {cards4} first_empty = {false} card_touch = {true} no_card_highlight = {false} movingIcons = {false}/>
        </div>

            {/* <img src={process.env.PUBLIC_URL + "/static/assets/solitaire_overview_1.png"} alt="" />
            <img src={process.env.PUBLIC_URL + "/static/assets/solitaire_overview_2.png"} alt="" />
            <img src={process.env.PUBLIC_URL + "/static/assets/solitaire_overview_3.png"} alt="" />
            <img src={process.env.PUBLIC_URL + "/static/assets/solitaire_overview_4.png"} alt="" />
            <img src={process.env.PUBLIC_URL + "/static/assets/solitaire_overview_5.png"} alt="" /> */}
    </div>
  )
}

export default DigitalBiomarkersPage