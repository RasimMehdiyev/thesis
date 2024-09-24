import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels'; 
import { Chart } from 'chart.js'; 


Chart.register(ChartDataLabels);

const StackedBarChart = ({ dataSets, maxRange = 100, showLegend = true }) => {
  const data = {
    labels: [''], 
    datasets: dataSets.map((dataSet) => ({
      label: dataSet.label,
      data: [dataSet.data], 
      backgroundColor: dataSet.backgroundColor,
      barThickness: 30,
    })),
  };

  const options = {
    maintainAspectRatio: false, // Disable the aspect ratio to control the chart size
    indexAxis: 'y', // Make the bar chart horizontal
    layout: {
      padding: {
        top: 0, 
        bottom: 0, 
      },
    },
    plugins: {
      legend: {
        display: showLegend, 
        position: 'top', 
        labels: {
          boxWidth: 15, 
          padding: 15, 
        },
      },
      datalabels: {
        display: true, 
        formatter: (value, context) => {
          const total = context.chart.data.datasets.reduce((acc, dataset) => acc + dataset.data[0], 0);
          const percentage = ((value / total) * 100).toFixed(2);
          return percentage + '%'; 
        },
        color: '#000', // Black
        anchor: 'center', 
        align: 'center', 
        font: {
        family: 'Poppins',
          size: 12, 
        },
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
  
  const containerHeight = showLegend ? '100px' : '135px'; 
  return (
    <div style={{ height: containerHeight, width: '220px' }}> 

      <Bar data={data} options={options} />
    </div>
  );
};

export default StackedBarChart;