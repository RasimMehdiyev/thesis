import React from 'react';
import StackedBarChart from './StackedBarChart'; 

const DemographicSummary= () => {


    
    const genderSet = [
        {
          label: 'Male',
          data: 47, 
          backgroundColor: '#C2B9F0', 
        },
        {
          label: 'Female',
          data: 53, 
          backgroundColor: '#7B61FF', 
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

return (
    <div className="card demographic-summary">
        <p className="ml-subtitle">Demographic summary</p>
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
            <td className="numbers vertical-line-left vertical-line">23</td>
            <td className="numbers">23</td>
          </tr>
          <tr>
            <td className="category dt-title">Age<br /><span className="dt-subtitle">Mean(SD)</span></td>
            <td className="numbers vertical-line-left vertical-line">70 (5.4)</td>
            <td className="numbers">80 (5.2)</td>
          </tr>
          <tr>
            <td className="category dt-title">MMSE score<br /><span className="dt-subtitle">Mean(SD)</span></td>
            <td className="numbers vertical-line-left vertical-line">29.61 (0.65)</td>
            <td className="numbers">26.17 (1.75)</td>
          </tr>
          <tr>
            <td className="category dt-title">MoCA score<br /><span className="dt-subtitle">Mean(SD)</span></td>
            <td className="numbers vertical-line-left vertical-line">28.09 (1.28)</td>
            <td className="numbers">N/A</td>
          </tr>
          <tr>
            <td className="category dt-title">CDR</td>
            <td className="numbers vertical-line-left vertical-line">0</td>
            <td className="numbers">N/A</td>
          </tr>
          <tr>
            <td className="category dt-title">Gender</td>
            <td>
            <StackedBarChart  dataSets={genderSet} maxRange={100} />
            </td>
            <td>
            <StackedBarChart  dataSets={genderSet} maxRange={100} showLegend={false} />
            </td>
          </tr>
          <tr>
            <td className="category dt-title">Education*</td>
            
              
            <td>
            <StackedBarChart  dataSets={educationSet} maxRange={100}  />
            </td>
              
            <td>
            <StackedBarChart  dataSets={educationSet} maxRange={100} showLegend={false}  />
            </td>
          </tr>
          <tr>
            <td className="category dt-title">Tablet use frequency</td>
            <td>
              <div className="frequency-bar vertical-line-left vertical-line">
                <span>Daily</span>
                <span>52%</span>
              </div>
              <div className="frequency-bar vertical-line-left vertical-line">
                <span>Weekly</span>
                <span>87%</span>
              </div>
              <div className="frequency-bar vertical-line-left vertical-line">
                <span>Never</span>
                <span>100%</span>
              </div>
            </td>
            <td>
              <div className="frequency-bar">
                <span>Daily</span>
                <span>30%</span>
              </div>
              <div className="frequency-bar">
                <span>Weekly</span>
                <span>65%</span>
              </div>
              <div className="frequency-bar">
                <span>Never</span>
                <span>100%</span>
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