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
        <div className="card" id='ml-card'>
           
            <p className="ml-subtitle" id="ml-p">Machine learning model</p>
                
            <div className='info'>
                <div className="personal-info-h">
                    <h3>Dataset information</h3>
                    <img
                    src='/assets/help_icon.svg'
                    alt='Help Icon'
                    className='icon'
                    onMouseEnter={showTooltip}  // Show tooltip on hover
                    onMouseLeave={hideTooltip}  // Hide tooltip when hover ends
                    style={{ cursor: 'pointer', marginBottom: 5 }}
                    />

                    <Tooltip
                        content="The machine learning models used data from <strong>46</strong> participants, which is a good starting point for initial research, though for the best results, similar models typically benefit from data from <strong>hundreds or thousands</strong> of participants."
                        isVisible={isTooltipVisible}
                        top={750} 
                        left={1500}
                    />
                </div>
                <hr className='horizontal-line'/>
                <div className='demographics-list'>
                    <p><strong>46 </strong>participants in total</p>
                    <ul>
                        <li><span style={{color: '#21AEEE'}}><strong>23</strong> healthy participants </span>with an average age of <strong>70</strong> </li>
                        <ul>
                            <em style={{listStyleType: "disc", marginTop: 0, fontSize: 16}}>
                            Recruited from senior groups and labeled as healthy based on cognitive assessments (MMSE, MoCA).
                            </em>
                        </ul>
                        <li style={{marginTop: 10}}><strong>23</strong> <span style={{color: '#FA5D5D'}}>MCI participants</span> with an average age of <strong>80</strong></li>
                        <ul>
                            <em style={{listStyleType: "disc", marginTop: 0, fontSize: 16}}>
                            Recruited from two leading memory clinics in Belgium where they had already been diagnosed with MCI.
                            </em>
                        </ul>
                    </ul>
                </div>
                <hr className='horizontal-line'/>
                <p className="demographics-list"><strong>138</strong> game rounds, <strong>9735</strong> player moves and <strong>791.7</strong> minutes of gameplay</p>
                <hr className='horizontal-line'/>
                <p className="demographics-list"><strong>19</strong> models trained with <strong>26</strong>/61 potential digital biomarkers</p>
            </div>

            <div className='test-scores'>
                <p id="prediction-title">Solitaire DSS prediction:</p>
                <p id="prediction-text">
                    The <span style={{ textDecoration: 'underline' }}>most accurate</span> machine learning model predicts that the patient is <span id="prediction-result">MCI</span> with a probability of <span id="confidence">83.3%</span>.
                </p>
            </div>

            <div className="accuracy">
                <a href="/machine-learning/" style={{textDecoration: 'underline', color: '#5A21EB', fontWeight: 600, marginTop:-30}}>More</a>
            </div>
        </div>
    )
}

export default MachineLearningModel;