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
    
    const fetchFromJsonFile = async () =>{
        const response = await fetch('/deck.json');
        const data = await response.json();
        console.log('Fetched Data:', data);
        // console.log(data);
        setCards(data);
        console.log('Cards state updated:', data);

    }

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
        
        <div class="biomarkers-list">
            {
                biomarkers.map(biomarker_type => (
                    <CategorizedBiomarker key={biomarker_type.id} biomarker_type={biomarker_type}/>
                ))
            }
        </div>
            <SolitaireAnimated cards = {cards}/>
            {/* <img src={process.env.PUBLIC_URL + "/static/assets/solitaire_overview_1.png"} alt="" />
            <img src={process.env.PUBLIC_URL + "/static/assets/solitaire_overview_2.png"} alt="" />
            <img src={process.env.PUBLIC_URL + "/static/assets/solitaire_overview_3.png"} alt="" />
            <img src={process.env.PUBLIC_URL + "/static/assets/solitaire_overview_4.png"} alt="" />
            <img src={process.env.PUBLIC_URL + "/static/assets/solitaire_overview_5.png"} alt="" /> */}
    </div>
  )
}

export default DigitalBiomarkersPage