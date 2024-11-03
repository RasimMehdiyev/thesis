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

  
  
    
  
  let xDataWithThreshold = [...new Set([...xData, xUser, threshold])];  // Ensures unique values only
  xDataWithThreshold.sort((a, b) => a - b);
  let yDataWithThreshold = [...yData];
  const insertAndInterpolate = (value, xData, yData) => {
    if (!xData.includes(value)) {
      const index = xData.findIndex(x => x > value);
      const prevIndex = index - 1;
      if (index === -1 || prevIndex < 0) {  // Edge cases for very first or last position
        yData.splice(index, 0, 0);  // Assuming a y value of 0 or another logical default
      } else {
        const interpolatedY = interpolate(
          xData[prevIndex], yData[prevIndex],
          xData[index], yData[index],
          value
        );
        yData.splice(index, 0, interpolatedY);
      }
      xData.splice(index, 0, value);
    }
  };
  
  insertAndInterpolate(threshold, xDataWithThreshold, yDataWithThreshold);
  insertAndInterpolate(xUser, xDataWithThreshold, yDataWithThreshold);
  

  

  const xUserIndex = xDataWithThreshold.indexOf(xUser);
  const edgeThreshold = 1; // Indices from the edges considered as near the edge
  const nearStartEdge = xUserIndex <= edgeThreshold;
  const nearEndEdge = xUserIndex >= xDataWithThreshold.length - edgeThreshold;



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
