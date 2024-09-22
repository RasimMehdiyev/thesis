import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CategorizedBiomarker from '../components/digital_biomarkers/CategorizedBiomarkers';
const DigitalBiomarkersPage = () => {

//  fetch all digital biomarkers
    const [biomarkers, setBiomarkers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('Component mounted, fetching biomarkers...');
        fetchBiomarkers();
    }, []);  // Empty dependency array ensures it only runs once on mount
    

    const fetchBiomarkers = async () => {
        console.log('Attempting to fetch biomarkers...');
        try {
            const response = await fetch('/dashboard/biomarkers/');
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
    


  return (
    <div className='container' id="biomarker-container">
        <div class="biomarkers-list">
            {/* <CategorizedBiomarker biomarker_type={biomarkers}/> */}
            {
                biomarkers.map(biomarker_type => (
                    <CategorizedBiomarker key={biomarker_type.id} biomarker_type={biomarker_type}/>
                ))
            }
        </div>
        <div className='solitaire-overview'>
            <img src={process.env.PUBLIC_URL + "/static/assets/solitaire_overview_1.png"} alt="" />
            <img src={process.env.PUBLIC_URL + "/static/assets/solitaire_overview_2.png"} alt="" />
            <img src={process.env.PUBLIC_URL + "/static/assets/solitaire_overview_3.png"} alt="" />
            <img src={process.env.PUBLIC_URL + "/static/assets/solitaire_overview_4.png"} alt="" />
            <img src={process.env.PUBLIC_URL + "/static/assets/solitaire_overview_5.png"} alt="" />
        </div>
    </div>
  )
}

export default DigitalBiomarkersPage