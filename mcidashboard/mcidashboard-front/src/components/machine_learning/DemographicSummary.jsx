import React,{useState} from 'react';
import StackedBarChart from './StackedBarChart'; 
import Tooltip from '../Tooltip'; 

const DemographicSummary= () => {

  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  // Show tooltip on mouse enter
  const showTooltip = () => {
    setIsTooltipVisible(true);
  };

  // Hide tooltip on mouse leave
  const hideTooltip = () => {
    setIsTooltipVisible(false);
  };

    
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
            src='/assets/help_icon.svg'
            alt='Help Icon'
            className='icon'
            onMouseEnter={showTooltip}  // Show tooltip on hover
            onMouseLeave={hideTooltip}  // Hide tooltip when hover ends
            style={{ cursor: 'pointer', marginTop: 5 }}
          />

          <Tooltip
            content="None of this data was used to train the machine learning models, which rely exclusively on digital biomarkers."
            isVisible={isTooltipVisible}
            left={350}
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
            
            <td className="numbers vertical-line-left vertical-line"> 
                <div className="chart-container">
                   <StackedBarChart  dataSets={genderSet} maxRange={100} />
                </div>
            </td>
        
            <td >
            <div className="chart-container">
                <StackedBarChart  dataSets={genderSet} maxRange={100} showLegend={false} padding={5}/>
            </div>
            </td>
          </tr>
          <tr>
            <td className="category dt-title">Education*</td>
   
            <td className="numbers vertical-line-left vertical-line">
            <div className="chart-container">
                <StackedBarChart  dataSets={educationSet} maxRange={100}  />
            </div>
            </td>
              
            <td>
            <div className="chart-container">
                <StackedBarChart  dataSets={educationSet} maxRange={100} showLegend={false}  />
            </div>
            </td>
          </tr>
          <tr>
            <td className="category dt-title">Tablet use frequency</td>
            <td className="numbers vertical-line-left vertical-line">
            <div className="chart-container">
               <StackedBarChart  dataSets={tabletSet} maxRange={100}/>
            </div>
            </td>
            <td>
            <div className="chart-container">
               <StackedBarChart  dataSets={tabletSet} maxRange={100} showLegend={false} />
            </div>
            </td>
          </tr>
          <tr>
            <td className="category dt-title">Klondike use frequency</td>
            <td className="numbers vertical-line-left vertical-line">
            <div className="chart-container">
                <StackedBarChart  dataSets={tabletSet} maxRange={100} showLegend={false}/>
            </div>
            </td>
            <td>
            <div className="chart-container">
                <StackedBarChart  dataSets={tabletSet} maxRange={100} showLegend={false} />
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