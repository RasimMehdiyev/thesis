import React, { useEffect } from 'react'; 
import DivergingBarChart from './DivergingBarChart';
import { useState } from 'react';

const FeatureImportance = () => {

    const [featureImportance, setFeatureImportance] = useState([]);
    const [featureNames, setFeatureNames] = useState([]);
    const [featureImportanceValues, setFeatureImportanceValues] = useState([]);

    const fetchFeatureImportance = async () => {
        const apiURL = '/dashboard/feature-importance/';
        const jsonURL = '/feature-importance.json';
        
        try {
            const response = await fetch(apiURL);
            if (response.ok) {
                const data = await response.json();
    
                // Sort the data by contribution values
                const sortedData = data.sort((a, b) => 
                    parseFloat(b['Contribution (%)']) - parseFloat(a['Contribution (%)'])
                );
    
                // Take top 4 positive and top 4 negative contributions
                const topPositive = sortedData.slice(0, 4);
                const topNegative = sortedData.slice(-4);
    
                // Combine top positive and negative contributions
                const selectedData = [...topPositive, ...topNegative];
    
                // Extract names and values from the selected features
                const names = selectedData.map(item => item.Feature);
                const values = selectedData.map(item => parseFloat(item['Contribution (%)'].replace('%', '')));
    
                setFeatureNames(names);
                setFeatureImportanceValues(values);
                setFeatureImportance(selectedData);
            } else {
                throw new Error('Failed to fetch feature importance');
            }
        } catch (error) {
            console.error(error);
            try {
                const response = await fetch(jsonURL);
                if (response.ok) {
                    const data = await response.json();
                    console.log('Fetched feature importance 2:', data);
    
                    const sortedData = data.sort((a, b) => 
                        parseFloat(b['Contribution (%)']) - parseFloat(a['Contribution (%)'])
                    );
    
                    const topPositive = sortedData.slice(0, 4);
                    const topNegative = sortedData.slice(-4);
                    
                    const selectedData = [...topPositive, ...topNegative];
    
                    const names = selectedData.map(item => item.Feature);
                    const values = selectedData.map(item => parseFloat(item['Contribution (%)'].replace('%', '')));
    
                    setFeatureNames(names);
                    setFeatureImportanceValues(values);
                    setFeatureImportance(selectedData);
                } else {
                    throw new Error('Failed to fetch feature importance from JSON fallback');
                }
            } catch (jsonError) {
                console.error('Error with fallback fetch:', jsonError);
            }
        }    
    }
    

    useEffect(() => {
        fetchFeatureImportance();
    }, []);

    return (
        <div className="card" id='importance-card' style={{ overflow: 'hidden', minWidth: 700 }}> 
            <div className="personal-info-h" style={{ display: 'flex', alignItems: 'center' }}>
                <p className="ml-subtitle" id="importance-p">Top digital biomarkers impacting the prediction</p>
                
            </div>

            <DivergingBarChart
                features={featureNames}
                percentages={featureImportanceValues}
            />
            <a className="accuracy" href="/digital-biomarkers/" style={{textDecoration: 'underline', color: '#5A21EB', fontWeight: 600, marginTop:-10, fontSize: 18}}>More</a>
        </div>
    )
}

export default FeatureImportance;