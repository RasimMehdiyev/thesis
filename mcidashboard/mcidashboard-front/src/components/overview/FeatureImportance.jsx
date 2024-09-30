import React, { useState } from 'react';
import Tooltip from '../Tooltip'; 
import DivergingBarChart from './DivergingBarChart';


const FeatureImportance = () => {
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);

    // Show tooltip on mouse enter
    const showTooltip = () => {
        setIsTooltipVisible(true);
    };

    // Hide tooltip on mouse leave
    const hideTooltip = () => {
        setIsTooltipVisible(false);
    };

    return (
        <div className="card" id='importance-card'>
            <div className="personal-info-h">
                <p className="ml-subtitle" id="importance-p">Importance of digital biomarkers</p>
                <img
                    src='/assets/help_icon.svg'
                    alt='Help Icon'
                    className='icon'
                    onMouseEnter={showTooltip}  // Show tooltip on hover
                    onMouseLeave={hideTooltip}  // Hide tooltip when hover ends
                    style={{ cursor: 'pointer' }}
                />

                <Tooltip
                    content="The <strong> importance of digital biomarkers </strong> component presents top digital biomarkers impacting the prediction."
                    isVisible={isTooltipVisible}
                    top={300} 
                    left={700}
                />
            </div>

            <DivergingBarChart
                features={['Average of Total Moves', 'Score', 'Average of Accuracy', 'Game time', 'Hint', 'Solved', 'Undo', 'Taps']}
                percentages={[10.1, 7.5, 6.5, 2.7, 2.2, -9.7, -5.4, -5.4]}
            />
            <a className="accuracy" href="/digital-biomarkers/" style={{textDecoration: 'underline', color: '#5A21EB', fontWeight: 600, marginTop:-10}}>More</a>
        </div>
    )
}

export default FeatureImportance;