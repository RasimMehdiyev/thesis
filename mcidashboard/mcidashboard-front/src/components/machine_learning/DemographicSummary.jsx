import React, { useState, useEffect } from 'react';
import StackedBarChart from './StackedBarChart'; 
import Tooltip from '../Tooltip'; 

const DemographicSummary = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDemographicSummary = async () => {
    let apiUrl = '/dashboard/machine-learning-data/';
    let fallbackUrl = '/machine-learning-data.json';

    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch from API: ${response.statusText}`);
      }

      const fetchedData = await response.json();
      console.log('Fetched Data from API:', fetchedData);

      setData(fetchedData);
    } catch (error) {
      console.error('Error fetching from API:', error);

      try {
        const fallbackResponse = await fetch(fallbackUrl);
        const fallbackData = await fallbackResponse.json();
        console.log('Fetched Data from fallback JSON:', fallbackData);

        setData(fallbackData);
      } catch (fallbackError) {
        console.error('Error fetching machine learning data from fallback JSON:', fallbackError);
        setError('Failed to fetch data from both sources');
      }
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchDemographicSummary();
  }, []);

  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const showTooltip = () => {
    setIsTooltipVisible(true);
  };

  const hideTooltip = () => {
    setIsTooltipVisible(false);
  };

  if (loading) {
    return <p>Loading...</p>;  // Show a loading message while data is being fetched
  }

  if (error) {
    return <p>Error: {error}</p>;  // Show an error message if data fails to load
  }

  if (!data || !data.patients) {
    return <p>No data available.</p>;  // Handle case where data or patients is null or undefined
  }
    
    const genderSet = [
        {
          label: 'Male',
          data: 47, 
        },
        {
          label: 'Female',
          data: 53, 
        }
  
      ];

      const educationSet = [
        {
          label: 'ISCED 1/2',
          data: 22, 
        },
        {
          label: 'ISCED 3/4',
          data: 30, 
        },
        {
            label: 'ISCED 5/6',
            data: 48, 
          },
      ];

      const tabletSet = [
        {
          label: 'Daily',
          data: 52, 
        },
        {
          label: 'Weekly',
          data: 9, 
        },
        {
            label: 'Monthly',
            data: 4.5, 
          },
        {
            label: 'Yearly or less',
            data: 4.5, 
          },
        {
            label: 'Never',
            data: 30, 
        },
      ];

return (
    <div className="card demographic-summary">
        <div className='personal-info-h' style={{ position: 'relative' }}>
        <p className="ml-subtitle">Demographic summary</p>
          <img
            src='/static/assets/info_icon.svg'
            alt='Info Icon'
            className='icon'
            onMouseEnter={showTooltip}  // Show tooltip on hover
            onMouseLeave={hideTooltip}  // Hide tooltip when hover ends
            style={{ cursor: 'pointer', marginTop: 5 }}
          />

          <Tooltip
            content="None of this data was used to train the machine learning models, which rely exclusively on digital biomarkers."
            isVisible={isTooltipVisible}
            left={370}
            top={-10}
          />
        </div>
        
        <table className="demographic-table">
        <thead>
          <tr>
            <th className="category"></th>
            <th className="numbers vertical-line-left vertical-line">Healthy</th>
            <th className="numbers">MCI</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="category dt-title">Sample size<br /><span className="dt-subtitle">Number of participants</span></td>
            <td className="numbers vertical-line-left vertical-line">{data.patients.healthy}</td>
            <td className="numbers">{data.patients.mci}</td>
          </tr>
          <tr>
            <td className="category dt-title">Age<br /><span className="dt-subtitle">Mean(Standard Deviation)</span></td>
            <td className="numbers vertical-line-left vertical-line">{data.patients.meanSD_age_healthy.mean} ({data.patients.meanSD_age_healthy.sd})</td>
            <td className="numbers">{data.patients.meanSD_age_mci.mean} ({data.patients.meanSD_age_mci.sd})</td>
          </tr>
          <tr>
            <td className="category dt-title">MMSE score<br /><span className="dt-subtitle">Mean(Standard Deviation)</span></td>
            <td className="numbers vertical-line-left vertical-line">{data.patients.meanSD_MMSE_score_healthy.mean} ({data.patients.meanSD_MMSE_score_healthy.sd})</td>
            <td className="numbers">{data.patients.meanSD_MMSE_score_mci.mean} ({data.patients.meanSD_MMSE_score_mci.sd})</td>
          </tr>
          <tr>
            <td className="category dt-title">MoCA score<br /><span className="dt-subtitle">Mean(Standard Deviation)</span></td>
            <td className="numbers vertical-line-left vertical-line">{data.patients.meanSD_MoCA_score_healthy.mean} ({data.patients.meanSD_MoCA_score_healthy.sd})</td>
            <td className="numbers">{data.patients.meanSD_MoCA_score_mci.mean ? data.patients.meanSD_MoCA_score_mci.mean : 'N/A'} {data.patients.meanSD_MoCA_score_mci.sd ? "(" + data.patients.meanSD_MoCA_score_mci.sd + ")" : ""}</td>
          </tr>
          <tr>
            <td className="category dt-title">CDR</td>
            <td className="numbers vertical-line-left vertical-line">0</td>
            <td className="numbers">N/A</td>
          </tr>
          <tr>
            <td className="category dt-title">Gender</td>
            
            <td className="numbers vertical-line-left vertical-line"> 
                <div className="chart-container">
                   <StackedBarChart  dataSets={genderSet} maxRange={100} />
                </div>
            </td>
        
            <td >
            <div className="chart-container">
                <StackedBarChart  dataSets={genderSet} maxRange={100} showLegend={true} padding={5}/>
            </div>
            </td>
          </tr>
          <tr>
            <td className="category dt-title">Education*</td>
   
            <td className="numbers vertical-line-left vertical-line">
            <div className="chart-container">
                <StackedBarChart  dataSets={data.patients.education_level_healthy} maxRange={100}  />
            </div>
            </td>
              
            <td>
            <div className="chart-container">
                <StackedBarChart  dataSets={data.patients.education_level_mci} maxRange={100} showLegend={true}  />
            </div>
            </td>
          </tr>
          <tr>
            <td className="category dt-title">Tablet use frequency</td>
            <td className="numbers vertical-line-left vertical-line">
            <div className="chart-container">
               <StackedBarChart  dataSets={data.patients.tablet_level_healthy} maxRange={100}/>
            </div>
            </td>
            <td>
            <div className="chart-container">
               <StackedBarChart  dataSets={data.patients.tablet_level_mci} maxRange={100} showLegend={true} />
            </div>
            </td>
          </tr>
          <tr>
            <td className="category dt-title">Klondike use frequency</td>
            <td className="numbers vertical-line-left vertical-line">
            <div className="chart-container">
                <StackedBarChart  dataSets={data.patients.cardgame_level_healthy} maxRange={100} showLegend={false}/>
            </div>
            </td>
            <td>
            <div className="chart-container">
                <StackedBarChart  dataSets={data.patients.cardgame_level_mci} maxRange={100} showLegend={false} />
            </div> 
            </td>
          </tr>
        </tbody>
      </table>
      <p className="notes">
      * Participants were categorised into 3 education groups according to the 1997 International Standard Classification of Education: ISCED 1/2 (basic education, typically completed by age 15), ISCED 3/4 (high school and vocational education), ISCED 5/6 (university-level education).
      </p>
    </div>

)
}
export default DemographicSummary 