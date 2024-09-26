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
        <div className="card" style={{width:'42%'}}>
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

            <div className='info'>
                <h3>Dataset information</h3>
                <hr className='horizontal-line'/>
                <div className='demographics-list'>
                    <p><strong>46 </strong>participants in total</p>
                    <ul>
                        <li><strong>23</strong> healthy participants with an average age of <strong>70</strong></li>
                        <li><strong>23</strong> MCI participants with an average age of <strong>80</strong></li>
                    </ul>
                </div>
                <hr className='horizontal-line'/>
                <p className="demographics-list"><strong>138</strong> rounds, <strong>9735</strong> moves and <strong>791.7</strong> minutes</p>
                <hr className='horizontal-line'/>
                <p className="demographics-list"><strong>19</strong> models trained with <strong>26</strong>/61 potential digital biomarkers.</p>
            </div>

            <div className='test-scores'>
                <p style={{fontWeight: 600, fontSize: 24}}>Solitaire DSS prediction:</p>
                <p style={{marginTop:-40}}>
                    The <span style={{ textDecoration: 'underline' }}>most accurate</span> machine learning model predicts that the patient is <span style={{ fontSize:30,color:'#FA5D5D', fontWeight:600 }}>MCI</span> .
                </p>
            </div>

            <div className="accuracy">
                <p style={{fontSize:20, fontWeight: 600}}>Highest model accuracy:</p>
                <p style={{marginTop:-20, fontWeight:600, fontSize:30, color:'#21AEEE'}}>83.3%</p>
                <a href="/machine-learning/" style={{textDecoration: 'underline', color: '#5A21EB', fontWeight: 600 }}>More</a>
            </div>
        </div>
    )
}

export default MachineLearningModel;