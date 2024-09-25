import Tooltip from '../Tooltip'; // Import the Tooltip component
import React, { useState} from 'react';
import DropdownTable from './DropdownTable'; 

const DigitalBiomarkers = () => {
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
        <div className="card" style={{width:'60%'}}>
            <div className="personal-info-h">
                <p className="ml-subtitle">Digital Biomarkers</p>
                <img
                    src='/assets/help_icon.svg'
                    alt='Help Icon'
                    className='icon'
                    onMouseEnter={showTooltip}  // Show tooltip on hover
                    onMouseLeave={hideTooltip}  // Hide tooltip when hover ends
                    style={{ cursor: 'pointer' }}
                    />

                <Tooltip
                top={100} 
                left={1150}
                content="Digital biomarkers are objective, quantifiable physiological and behavioral measures that are collected and analyzed by means of digital devices. They can be used to monitor and diagnose various health conditions."
                isVisible={isTooltipVisible}
                />
                
                <div className="graph-legend">
                    <div className="legend-item">
                        <span className="dash" style={{backgroundColor: '#FA5D5D'}}></span>
                        <p><strong>MCI</strong> (cognitively impaired)</p>
                    </div>
                    <div className="legend-item">
                        <span className="dash" style={{backgroundColor: '#21AEEE'}}></span>
                        <p><strong>Healthy</strong> (normally aging)</p>
                    </div>
                </div>
           </div>
           <DropdownTable />
        </div>
    )
}

export default DigitalBiomarkers;