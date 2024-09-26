import Tooltip from '../Tooltip'; 
import React, { useState} from 'react';


const MachineLearningModel = () => {
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
        <div className="card" style={{width:'40%'}}>
            <div className="personal-info-h">
            <p className="ml-subtitle">Machine learning model</p>
                <img
                src='/assets/help_icon.svg'
                alt='Help Icon'
                className='icon'
                onMouseEnter={showTooltip}  // Show tooltip on hover
                onMouseLeave={hideTooltip}  // Hide tooltip when hover ends
                style={{ cursor: 'pointer' }}
                />

                <Tooltip
                content="<strong> Machine Learning model </strong> component presents prediction result, description of dataset, and model accuracy."
                isVisible={isTooltipVisible}
                top={620} 
                left={1500}
                />
            </div>
        </div>
    )
}

export default MachineLearningModel;