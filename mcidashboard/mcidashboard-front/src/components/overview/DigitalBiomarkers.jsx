import Tooltip from '../Tooltip';
import React, { useState, useEffect } from 'react';
import DropdownTable from './DropdownTable'; 
import GameHistoryLineChart from './GameHistoryLineChart';
import DataDistributionChart from './DataDistributionChart';

const DigitalBiomarkers = ({ patient }) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('Min Move Time');
  const [metricData, setMetricData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gameHistory, setGameHistory] = useState(null);
  const [threshold, setThreshold] = useState(0);
  const [isLowGood, setIsLowGood] = useState();

  const showTooltip = () => setIsTooltipVisible(true);
  const hideTooltip = () => setIsTooltipVisible(false);


 const biomarkerNametoId = {
    'Average Accuracy': 14,
    'Min Move Time': 24,
    'Beta Error': 10,
    'Average Move Time': 5,
    'Cards Moved': 27,
    'Erroneous Move': 13,
    'Final Beta Error': 11,
    'Game Time': 19,
    'Max Accuracy': 26,
    'Min Accuracy': 25,
    'SD Accuracy': 15,
    'Taps': 16,
    'SD Total Time': 2,
    'Successful Move': 12,
    'Suit Error': 29,
    'SD Think Time': 4,
    'Pile Move': 7,
    'Rank Error': 28,
    'Score': 20,
    'Average Total Time': 1,
    'Average Think Time': 3,
    'Min Think Time': 23,
  }

  useEffect(() => {
    console.log('selectedMetric:', selectedMetric);
    var metricId = biomarkerNametoId[selectedMetric];
    console.log('metricId:', metricId);
    if (patient && metricId !== undefined) {
      fetchMetricData(patient.id, metricId);
      fetchGameHistory(patient.id, metricId);
    }else{
        setLoading(false);
    }
  }, [patient, selectedMetric]);  


  const getMessage = () => {
    const biomarkerValue = metricData?.current_user.biomarker_value;
    const action = isLowGood && biomarkerValue > threshold ? "reduces" : "increases";

    
    if (biomarkerValue > threshold && isLowGood) {
      return(
        <>
          If {selectedMetric} <span style={{color: "#21AEEE"}}>reduces to {threshold}</span>, Solitaire DSS would think the player is normally aging.
        </>
      )}
    else if (biomarkerValue < threshold && isLowGood) {
      return(
        <>
          If {selectedMetric} <span style={{color: "#FA5D5D"}}>increases to {threshold}</span>, Solitaire DSS would think the player is cognitively impaired.
        </>
      )}
    else if (biomarkerValue > threshold && !isLowGood) {
      return(
        <>
          If {selectedMetric} <span style={{color: "#FA5D5D"}}>reduces to {threshold}</span>, Solitaire DSS would think the player is cognitively impaired.
        </>
      )}
    else if (biomarkerValue < threshold && !isLowGood) {
      return(
        <>
          If {selectedMetric} <span style={{color: "#21AEEE"}}>increases to {threshold}</span>, Solitaire DSS would think the player is normally aging.
        </>
      )}   
      else if(biomarkerValue === threshold){
        return(
          <>
            The player's {selectedMetric} is at the threshold value of {threshold}. If their value was {isLowGood ? "decreased" : "increased"} they would be considered healthier.
          </>
        )
      }
  };
  


  const fetchMetricData = async (patientId, metric) => {
    setLoading(true);
    try {
      // const response = await fetch('/metrics1000.json');
      const response = await fetch(`/dashboard/biomarker/histograms/${patientId}/${metric}/`);
      // const response = await fetch(`http://localhost:8000/dashboard/biomarker/histograms/484/6/`);
      const data = await response.json();
      console.log('Fetched Metric Data:', data);
      setMetricData(data);
      setThreshold(Math.round(data.threshold*100)/100);
      setIsLowGood(data.isLowGood);
    } catch (error) {
      console.error('Error fetching metric data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGameHistory = async (patientId, metric) => {
    setLoading(true);
    try {
      const response = await fetch(`/dashboard/game/history/${patientId}/${metric}/`);
      const data = await response.json();
      console.log('Fetched Game History:', data);
      setGameHistory(data);
    } catch (error) {
      console.error('Error fetching game history:', error);
    } finally {
      setLoading(false);
    }
}

const splitDataDistChartData = (metricData_loc) => {
    const xData = metricData_loc.map(item=>item.biomarker_value);
    const yData = metricData_loc.map(item=>item.frequency);

    const sortedVal = [...xData].sort((a, b) => a - b);
    const midIndex = Math.floor(sortedVal.length / 2);
    // const median = sortedVal.length % 2 !== 0 ? sortedVal[midIndex] : (sortedVal[midIndex - 1] + sortedVal[midIndex]) / 2;
    return { xData, yData, threshold };
};


const splitData = (gameHistory) => {
    const data = [];
    const labels = [];
    for (const key in gameHistory) {
        let date = new Date(parseInt(key));
        let formattedDate = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

        data.push(gameHistory[key]);
        labels.push(formattedDate);
    }
    let minLimit = Math.floor(Math.min(...data) / 10) * 10;
    let maxLimit = Math.ceil(Math.max(...data)) + Math.abs(minLimit/2.5) + 5;

    if (maxLimit === 0 && minLimit === 0) {
        maxLimit = 1;
        minLimit = -1;
    }        

    console.log('splitData:', { data, labels, minLimit, maxLimit });
    return { data, labels, minLimit, maxLimit };
};

const { 
    data: gameHistoryData = [], 
    labels: gameHistoryLabels = [], 
    minLimit = 0, 
    maxLimit = 70 
} = gameHistory ? splitData(gameHistory) : {};



// Process MCI and healthy data
const { 
    xData: xData_mci = [], 
    yData: yData_mci = [], 
} = metricData?.mci ? splitDataDistChartData(metricData.mci) : {};

const { 
    xData: xData_healthy = [], 
    yData: yData_healthy = [], 
} = metricData?.healthy ? splitDataDistChartData(metricData.healthy) : {};


const xUser = metricData?.xUser || 0;

console.log('MCI Data:', { xData_mci, yData_mci, threshold });
console.log('Healthy Data:', { xData_healthy, yData_healthy, threshold });



  return (
    <div className="card" id="dig-card">
      <div className="personal-info-h" style={{ position: 'relative' }}>
        <p className="ml-subtitle" id="dbm-p">Digital Biomarkers</p>
        <img
          src='/static/assets/info_icon.svg'
          alt='Info Icon'
          className='icon'
          onMouseEnter={showTooltip}
          onMouseLeave={hideTooltip}
          style={{ cursor: 'pointer' }}
        />
        <Tooltip
          top={10} 
          left={280}
          content="This is the data on which the prediction is based."
          isVisible={isTooltipVisible}
        />
        <div className="graph-legend">
          <div className="legend-item">
            <span className="dash" style={{ backgroundColor: '#FA5D5D' }}></span>
            <p><strong>MCI</strong> (cognitively impaired)</p>
          </div>
          <div className="legend-item">
            <span className="dash" style={{ backgroundColor: '#21AEEE' }}></span>
            <p><strong>Healthy</strong> (normally aging)</p>
          </div>
        </div>
      </div>

      <DropdownTable onOptionSelect={setSelectedMetric} />

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <div className="grid-container">
          <div className="grid-item">
            
            <GameHistoryLineChart data={gameHistoryData} labels={gameHistoryLabels} minLimit = {minLimit} maxLimit = {maxLimit}/>
          </div>
          <div className="grid-item">
            <p style={{ fontSize: 14 }}>{selectedMetric} of the last session in the histogram of all <strong>MCI</strong> players.</p>
            <DataDistributionChart xData={xData_mci} yData={yData_mci} threshold={threshold} xUser={metricData?.current_user.biomarker_value} swapColors={!isLowGood} xUserLabel={patient.full_name}/>
          </div>
          <div
            className="grid-item test-scores"
            style={{ fontSize: 16, fontWeight: 600, marginTop: 50 }}
          >
            <p>
              {selectedMetric} of the last session:{" "}
              <span
                style={{
                  color: ((metricData?.current_user.biomarker_value < threshold && isLowGood) || (metricData?.current_user.biomarker_value > threshold && !isLowGood)) ? "#21AEEE" : "#FA5D5D",
                }}
              >
                {metricData?.current_user.biomarker_value}
              </span>
            </p>
            <p className="counterfactuals">{getMessage()}</p>
          </div>
          <div className="grid-item">
            <p style={{ fontSize: 14 }}>{selectedMetric} of the last session in the histogram of all <strong>Healthy</strong> players.</p>
            <DataDistributionChart xData={xData_healthy} yData={yData_healthy} threshold={threshold} xUser={metricData?.current_user.biomarker_value} xUserLabel={patient.full_name} swapColors={!isLowGood}/>
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalBiomarkers;
