import Tooltip from '../Tooltip'; 
import React, { useState } from 'react';
import { useEffect } from 'react';

const MachineLearningModel = () => {
    const [isDatasetTooltipVisible, setIsDatasetTooltipVisible] = useState(false);
    const [isPredictionTooltipVisible, setIsPredictionTooltipVisible] = useState(false);
    const [machineLearningData, setMachineLearningData] = useState(null);
    const [loading, setLoading] = useState(true);

    const showDatasetTooltip = () => {
        setIsDatasetTooltipVisible(true);
    };

    const hideDatasetTooltip = () => {
        setIsDatasetTooltipVisible(false);
    };

    const showPredictionTooltip = () => {
        setIsPredictionTooltipVisible(true);
    };

    const hidePredictionTooltip = () => {
        setIsPredictionTooltipVisible(false);
    };

    const fetchMLData = async () => {
        let apiUrl = '/dashboard/machine-learning-data/';
        let fallbackUrl = '/machine-learning-data.json';
    
        try {
 
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`Failed to fetch from API: ${response.statusText}`);
            }
    
            const data = await response.json();
            console.log('Fetched Data from API:', data);
    
            if (data) {
                setMachineLearningData(data);
            } else {
                console.error('No machine learning data found in the API response.');
            }
        } catch (error) {
            console.error('Error fetching from API:', error);
            
            try {
                const fallbackResponse = await fetch(fallbackUrl);
                const fallbackData = await fallbackResponse.json();
                console.log('Fetched Data from fallback JSON:', fallbackData);
    
                if (fallbackData) {
                    setMachineLearningData(fallbackData);
                } else {
                    console.error('No machine learning data found in the fallback JSON.');
                }
            } catch (fallbackError) {
                console.error('Error fetching machine learning data from fallback JSON:', fallbackError);
            }
        } finally {
            setLoading(false); 
        }
    };
    


    useEffect(() => {
        fetchMLData();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }else{
    return (
        <div className="card" id='ml-card'>
            <p className="ml-subtitle" id="ml-p">Machine learning model</p>
            
            <div className='info'>
                <div className="personal-info-h" style={{ position: 'relative' }}>
                    <h3>Dataset information</h3>
                    <img
                        src='/assets/info_icon.svg'
                        alt='Info Icon'
                        className='icon'
                        onMouseEnter={showDatasetTooltip}  // Show dataset tooltip on hover
                        onMouseLeave={hideDatasetTooltip}  // Hide dataset tooltip when hover ends
                        style={{ cursor: 'pointer', marginBottom: 5 }}
                    />

                    <Tooltip
                        content="The machine learning models used data from <strong>46</strong> participants, which is a good starting point for initial research, though for the best results, similar models typically benefit from data from <strong>hundreds or thousands</strong> of participants."
                        isVisible={isDatasetTooltipVisible}
                        top={-70} 
                        left={270}
                    />
                </div>
                
                <hr className='horizontal-line'/>

                <div className='demographics-list'>
                    <p><strong>{machineLearningData.patients.mci + machineLearningData.patients.healthy} </strong>participants in total</p>
                    <ul>
                        <li><strong>{machineLearningData.patients.healthy}</strong> <span style={{color: '#21AEEE'}}>healthy participants </span>with an average age of <strong>{machineLearningData.patients.healthy_avg_age}</strong> </li>
                        <ul>
                            <em style={{listStyleType: "disc", marginTop: 0, fontSize: 16}}>
                                Recruited from senior groups and labeled as healthy based on cognitive assessments (MMSE, MoCA).
                            </em>
                        </ul>
                        <li style={{marginTop: 10}}><strong>{machineLearningData.patients.mci}</strong> <span style={{color: '#FA5D5D'}}>MCI participants</span> with an average age of <strong>{machineLearningData.patients.mci_avg_age}</strong></li>
                        <ul>
                            <em style={{listStyleType: "disc", marginTop: 0, fontSize: 16}}>
                                Recruited from two leading memory clinics in Belgium where they had already been diagnosed with MCI.
                            </em>
                        </ul>
                    </ul>
                </div>

                <hr className='horizontal-line'/>

                <p className="demographics-list"><strong>{machineLearningData.total_games}</strong> game rounds, <strong>{machineLearningData.total_moves}</strong> player moves and <strong>{machineLearningData.total_game_time}</strong> minutes of gameplay</p>
                <hr className='horizontal-line'/>
                <p className="demographics-list"><strong>19</strong> models trained with <strong>26</strong>/61 potential digital biomarkers</p>
            </div>

            <div className='test-scores'>
                <div className="personal-info-h" style={{ position: 'relative' }}>
                    <p id="prediction-title">Solitaire DSS prediction:</p>
                    <img
                        src='/assets/info_icon.svg'
                        alt='Info Icon'
                        className='icon'
                        onMouseEnter={showPredictionTooltip}  // Show prediction tooltip on hover
                        onMouseLeave={hidePredictionTooltip}  // Hide prediction tooltip when hover ends
                        style={{ cursor: 'pointer', marginBottom: 15 }}
                    />

                    <Tooltip
                        content="The system distinguishes between healthy individuals and those with MCI but doesn’t assess MCI severity or predict its progression to dementia, limiting its use for prognosis or treatment guidance."
                        isVisible={isPredictionTooltipVisible}
                        top={-70} 
                        left={370}
                    />
                </div>
                
                <p id="prediction-text">
                    The <span style={{ textDecoration: 'underline' }}>most accurate</span> machine learning model predicts that the patient is <span id="prediction-result">MCI</span> with a probability of <span id="confidence">83.3%</span>.
                </p>
            </div>

            <div className="accuracy">
                <a id="more" href="/machine-learning/" style={{textDecoration: 'underline', color: '#5A21EB', fontWeight: 600, marginTop:-30}}>More</a>
            </div>
        </div>
    );
}
};

export default MachineLearningModel;
