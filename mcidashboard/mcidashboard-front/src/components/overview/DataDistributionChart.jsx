import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register necessary components and plugins
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels);

const DataDistributionChart = ({ xData, yData, threshold, xUser, xUserLabel, swapColors }) => {
  const interpolate = (x1, y1, x2, y2, x) => {
    return y1 + ((y2 - y1) * (x - x1)) / (x2 - x1);
  };

  const maxLimit = Math.ceil(Math.max(...yData) + 1);
  const belowThresholdColor = swapColors ? 'rgba(250, 93, 93, 1)' : 'rgba(33, 174, 238, 1)';
  const aboveThresholdColor = swapColors ? 'rgba(33, 174, 238, 1)' : 'rgba(250, 93, 93, 1)';


  
  let xDataWithThreshold = [...xData];
  
  if (!xData.includes(xUser)) {
    xDataWithThreshold.push(xUser);
  }
    
  /*
  if (!xDataWithThreshold.includes(threshold)) {
    xDataWithThreshold.push(threshold);
  }*/
    
  xDataWithThreshold.sort((a, b) => a - b);

  console.log('xDataWithThreshold:', xDataWithThreshold);
  console.log('yData:', yData);

  let yDataWithThreshold = [...yData];

  if (!xDataWithThreshold.includes(threshold)) {
    const thresholdIndex = xDataWithThreshold.findIndex(x => x > threshold);
    xDataWithThreshold.splice(thresholdIndex, 0, threshold);
    const interpolatedYThreshold = interpolate(
      xDataWithThreshold[thresholdIndex - 1], yDataWithThreshold[thresholdIndex - 1],
      xDataWithThreshold[thresholdIndex], yDataWithThreshold[thresholdIndex - 1],
      threshold
    );
    yDataWithThreshold.splice(thresholdIndex, 0, interpolatedYThreshold);
  }

  // Ensure xUser is interpolated if necessary
  
  if (!xData.includes(xUser)) {
    const indexBefore = xDataWithThreshold.findIndex(x => x > xUser) - 1;
    const x1 = xDataWithThreshold[indexBefore];
    const y1 = yData[indexBefore];
    const x2 = xDataWithThreshold[indexBefore + 1];
    const y2 = yData[indexBefore + 1];
    const interpolatedY = interpolate(x1, y1, x2, y2, xUser);
    yDataWithThreshold.splice(indexBefore + 1, 0, interpolatedY);
  }

  const xUserIndex = xDataWithThreshold.indexOf(xUser);
  const edgeThreshold = 1; // Indices from the edges considered as near the edge
  const nearStartEdge = xUserIndex <= edgeThreshold;
  const nearEndEdge = xUserIndex >= xDataWithThreshold.length - edgeThreshold;


  // also, if the xUser is not in xDataWithThreshold, then add a point in xDataWithThreshold that is xUser and a point in yDataWithThreshold that is 0
  if (!xDataWithThreshold.includes(xUser)) {
    xDataWithThreshold.push(xUser);
    yDataWithThreshold.push(0);
  }

  // in xDataWithThreshold, add a point in the beginning and at then that is 1 less than first value and 1 more than last value respectively, similarly add a point in yDataWithThreshold that is 0 at the beginning and 0 at the end
  xDataWithThreshold = [Math.round(xDataWithThreshold[0] - 1, 0), ...xDataWithThreshold, xDataWithThreshold[xDataWithThreshold.length - 1] + 1];
  yDataWithThreshold = [0, ...yDataWithThreshold, 0];

  const data = {
    labels: xDataWithThreshold,
    datasets: [{
      label: 'Data Points',
      data: yDataWithThreshold,
      borderColor: belowThresholdColor,
      //backgroundColor: (ctx) => ctx.p1DataIndex < xDataWithThreshold.indexOf(threshold)+10 ? belowThresholdColor.replace('1)', '0.2)') : aboveThresholdColor.replace('1)', '0.2)'),
      fill: true,
      tension: 0.4,
      pointRadius: xDataWithThreshold.map(x => x === xUser ? 6 : 0), // Show a point only for xUser
      pointBorderColor: xDataWithThreshold.map((x, index) => x === xUser ? (xUser > threshold ? aboveThresholdColor : belowThresholdColor) : 'rgba(0, 0, 0, 0)'), 
      pointBackgroundColor: xDataWithThreshold.map((x, index) => x === xUser ? (xUser > threshold ? aboveThresholdColor.replace('1)', '0.2)') : belowThresholdColor.replace('1)', '0.2)')) : 'rgba(0, 0, 0, 0)'), 
      segment: {
        borderColor: ctx => ctx.p1DataIndex < xDataWithThreshold.indexOf(threshold)+1 ? belowThresholdColor : aboveThresholdColor,
        backgroundColor: ctx => ctx.p1DataIndex < xDataWithThreshold.indexOf(threshold)+1 ? belowThresholdColor.replace('1)', '0.2)') : aboveThresholdColor.replace('1)', '0.2)')
      }
    },
    {
      label: 'Threshold',
      data: [{x: threshold, y: 0}, {x: threshold, y: maxLimit}], // maxLimit defined earlier
      borderColor: 'gray',
      borderWidth: 2,
      borderDash: [10, 5],
      fill: false,
      showLine: true,
      pointRadius: 0,
      type: 'line'
    }
  ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: nearStartEdge || nearEndEdge? 50 : 10, // Increase left padding if xUser is near the start
        right: nearEndEdge || nearStartEdge ? 50 : 10, // Increase right padding if xUser is near the end
        top: 10,
        bottom: 10
      }
    },
    scales: {
      x: {
        grid: {
          display: true
        },
        ticks: {
          display: true,
          color: function(context) {
            if (context.tick.value === xDataWithThreshold.indexOf(xUser)) {
                return xUser > threshold ? aboveThresholdColor : belowThresholdColor;
            }
            return '#666';
          },
          
          font: function(context) {
            if (context.tick.value === xDataWithThreshold.indexOf(threshold) || context.tick.value === xDataWithThreshold.indexOf(xUser)) {
              return {
                weight: 'bold',
                size: 12
              };
            }
            return {
              size: 12
            };
          }
        }
      },
      y: {
        beginAtZero: true,
        suggestedMax: maxLimit,
        grid: {
          display: false
        },
        ticks: {
          display: false,
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true
      },
      datalabels: {
        color: '#444',
        anchor: 'end', 
        align: 'end', 
        font: {
          weight: 'bold',
          size: 12
        },
        formatter: (value, ctx) => {
          if (ctx.dataIndex === xUserIndex) {
            return xUserLabel; // Display custom xUserLabel
          }
          return null;
        },
        display: function(context) {
          return context.chart.data.datasets[context.datasetIndex].data[context.dataIndex].x !== threshold; // Display label only for xUser
        }
      }
    }
  };
  
  return <div style={{ width: '100%', height: '100%' }}>
    <Line data={data} options={options} />
  </div>;
};
  
export default DataDistributionChart;
