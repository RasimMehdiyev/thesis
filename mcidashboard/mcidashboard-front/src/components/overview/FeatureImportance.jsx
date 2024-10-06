import React from 'react'; 
import DivergingBarChart from './DivergingBarChart';

const FeatureImportance = () => {


    return (
        <div className="card" id='importance-card' style={{ overflow: 'hidden', minWidth: 700 }}> 
            <div className="personal-info-h" style={{ display: 'flex', alignItems: 'center' }}>
                <p className="ml-subtitle" id="importance-p">Top digital biomarkers impacting the prediction</p>
                
            </div>

            <DivergingBarChart
                features={['Average of Total Moves', 'Score', 'Average of Accuracy', 'Game time', 'Hint', 'Solved', 'Undo', 'Taps']}
                percentages={[10.1, 7.5, 6.5, 2.7, 2.2, -9.7, -5.4, -5.4]}
            />
            <a className="accuracy" href="/digital-biomarkers/" style={{textDecoration: 'underline', color: '#5A21EB', fontWeight: 600, marginTop:-10, fontSize: 18}}>More</a>
        </div>
    )
}

export default FeatureImportance;