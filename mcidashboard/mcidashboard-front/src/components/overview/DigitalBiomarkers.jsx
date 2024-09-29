import Tooltip from '../Tooltip'; // Import the Tooltip component
import React, { useState} from 'react';
import DropdownTable from './DropdownTable'; 
import GameHistoryLineChart from './GameHistoryLineChart';
import DataDistributionChart from './DataDistributionChart';

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

    const data = [55, 57, 60, 65, 62, 67, 70];
    const labels = ['13 Jan', '22 Jan', '26 Jan', '2 Feb', '5 Feb']; 

    const xData=[40, 60, 66, 80, 100, 120];
    const yData=[50, 62, 66, 75, 70, 68];
    const threshold = 62;

    
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
           <div className="grid-container">
                <div className="grid-item">
                    <GameHistoryLineChart data={data} labels={labels} />
                </div>
                <div style={{marginTop: 60}}className="grid-item">
                    <p style={{fontSize:14}}>Total Moves of the last session in the histogram of all <strong>MCI</strong> players.</p>
                    <DataDistributionChart xData={xData} yData={yData} threshold={threshold} xUser={99} swapColors={true}/>
                </div>
                <div className="grid-item test-scores" style={{fontSize: 14, fontWeight: 600, marginTop:50}}>
                    <p>Total moves of the last session: <span style={{color:'#FA5D5D'}}>66</span></p>
                    <p className="counterfactuals">If Total Moves <span style={{color:'#21AEEE'}}>reduces to 62</span>, Solitaire DSS would think the player is normally aging.</p>
                </div>
                
                <div className="grid-item">
                <p style={{fontSize:14}}>Total Moves of the last session in the histogram of all <strong>Healthy</strong> players.</p>
                <img
                    src="/assets/data-distribution2.png"
                    alt="Performance Metrics"
                    style={{ width: '100%', height: 'auto' }}
                    />
                </div>
            </div>
        </div>
    )
}

export default DigitalBiomarkers;