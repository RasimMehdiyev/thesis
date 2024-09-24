import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const StackedBarChart = ({ dataSets, maxRange = 100 }) => {
  const data = {
    labels: [''], // Empty label for the single bar
    datasets: dataSets.map((dataSet) => ({
      label: dataSet.label,
      data: [dataSet.data], // Single data point for each dataset
      backgroundColor: dataSet.backgroundColor,
      barThickness: 30, 
    })),
  };

  const options = {
    maintainAspectRatio: false, // Disable the aspect ratio to control the chart size
    indexAxis: 'y', // This makes the bar chart horizontal
    plugins: {
      legend: {
        display: false, 
      },
    },
    scales: {
      x: {
        beginAtZero: true, 
        max: maxRange, // Set maximum value of the X-axis to control bar length
        stacked: true, 
        ticks: {
          stepSize: maxRange / 5, // Divide the steps based on the max range
          display: false, 
        },
        grid: {
          display: false, 
        },
        border: {
            display: false, 
          },
      },
      y: {
        stacked: true, 
        grid: {
          display: false, 
        },
        ticks: {
          display: false, // Hide Y-axis labels (since it's a single bar)
        },
        border: {
            display: false, 
          },
      },
    },
  };

  return (
    <div style={{ height: '50px', width: '250px' }}> 
      <Bar data={data} options={options} />
    </div>
  );
};

export default StackedBarChart;