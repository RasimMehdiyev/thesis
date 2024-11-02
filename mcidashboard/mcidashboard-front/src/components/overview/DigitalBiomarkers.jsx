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

  const showTooltip = () => setIsTooltipVisible(true);
  const hideTooltip = () => setIsTooltipVisible(false);


  /*
    ['Accuracy', 'Average Accuracy', 'Average Move Time'],
    ['Average Think Time', 'Average Total Time', 'Beta Error'],
    ['Cards Moved', 'Erroneous Move', 'Final Beta Error'],
    ['Game Time', 'Max Accuracy', 'Min Accuracy'],
    ['Min Move Time', 'Min Think Time', 'Min Total Time'],
    ['Pile Move', 'Rank Error', 'Score'],
    ['SD Accuracy', 'SD Move Time', 'SD Think Time'],
    ['SD Total Time', 'Successful Move', 'Suit Error'],
    ['Taps', 'Total Moves', ''],
  */


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

  const fetchMetricData = async (patientId, metric) => {
    setLoading(true);
    try {
      const response = await fetch('metrics1000.json');//const response = await fetch(`/dashboard/biomarker/histograms/${patientId}/${metric}/`);
      const data = await response.json();
      console.log('Fetched Metric Data:', data);
      setMetricData(data);
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

const splitDataDistChartData = (metricData) => {
    const xData = metricData.map(item=>item.biomarker_value);
    const yData = metricData.map(item=>item.frequency);


    const sortedVal = [...xData].sort((a, b) => a - b);
    const midIndex = Math.floor(sortedVal.length / 2);
    const median = sortedVal.length % 2 !== 0 ? sortedVal[midIndex] : (sortedVal[midIndex - 1] + sortedVal[midIndex]) / 2;
    const threshold = median;

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
    const minLimit = Math.floor(Math.min(...data) / 10) * 10;
    const maxLimit = Math.ceil(Math.max(...data) / 10) * 10 + 20;

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
    threshold: threshold_mci = 0 
} = metricData?.mci ? splitDataDistChartData(metricData.mci) : {};

const { 
    xData: xData_healthy = [], 
    yData: yData_healthy = [], 
    threshold: threshold_healthy = 0 
} = metricData?.healthy ? splitDataDistChartData(metricData.healthy) : {};

const xUser = metricData?.xUser || 0;

console.log('MCI Data:', { xData_mci, yData_mci, threshold_mci });
console.log('Healthy Data:', { xData_healthy, yData_healthy, threshold_healthy });

  return (
    <div className="card" id="dig-card">
      <div className="personal-info-h" style={{ position: 'relative' }}>
        <p className="ml-subtitle" id="dbm-p">Digital Biomarkers</p>
        <img
          src='/assets/info_icon.svg'
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
            <DataDistributionChart xData={xData_mci} yData={yData_mci} threshold={threshold_mci} xUser={metricData?.current_user.biomarker_value} swapColors={true} />
          </div>
          <div className="grid-item test-scores" style={{ fontSize: 16, fontWeight: 600, marginTop: 50 }}>
            <p>{selectedMetric} of the last session: <span style={{ color: '#FA5D5D' }}>{metricData?.current_user.biomarker_value}</span></p>
            <p className="counterfactuals">If {selectedMetric} <span style={{ color: '#21AEEE' }}>reduces to {metricData?.counterfactual}</span>, Solitaire DSS would think the player is normally aging.</p>
          </div>
          <div className="grid-item">
            <p style={{ fontSize: 14 }}>{selectedMetric} of the last session in the histogram of all <strong>Healthy</strong> players.</p>
            <DataDistributionChart xData={xData_healthy} yData={yData_healthy} threshold={threshold_healthy} xUser={metricData?.current_user.biomarker_value} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalBiomarkers;
