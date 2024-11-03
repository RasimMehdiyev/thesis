import React, { useRef, useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const DivergingBarChart = ({ features, percentages }) => {
  const chartRef = useRef(null);
  const data = {
    labels: features, 
    datasets: [
      {
        label: 'Towards MCI',
        backgroundColor: 'rgba(250, 93, 93, 0.6)', 
        data: percentages.map((value) => (value > 0 ? value : 0)), // Positive values for MCI
        barThickness: 25,
      },
      {
        label: 'Towards healthy',
        backgroundColor: 'rgba(33, 174, 238, 0.6)',
        data: percentages.map((value) => (value < 0 ? value : 0)), // Negative values for healthy
        barThickness: 25, 
      },
    ],
  };

  const options = {
    indexAxis: 'y', 
    layout: {
      padding: {
        right: 30
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        min: -20, 
        max: 20, 
        grid: {
          display: true, 
          color: 'rgba(0, 0, 0, 0.1)', 
        },
        ticks: {
          display: false, 
        },
      },
      y: {
        display: true, 
        grid: {
          display: true, 
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#000',
          font: {
            family: 'Poppins', 
            size: 15, 
            weight: '500', 
          },
          padding: 30, 
          autoSkip: false, 
          maxRotation: 0, 
          minRotation: 0,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
      datalabels: {
        display: true, 
        color: '#000',
        anchor: (context) => (context.datasetIndex === 0 ? 'end' : 'start'),
        align: (context) => (context.datasetIndex === 0 ? 'right' : 'left'), 
        font: {
          family: 'Poppins', 
          size: 12,
          weight: '500', 
        },
        clip: false,
        formatter: (value) => (value !== 0 ? `${value}%` : ''), // Only show non-zero values
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ width: '100%', height: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: -40,
          paddingLeft: '20px',
          paddingRight: '30px',
          width: '100%',
        }}
      >
        {/* Left arrow and text */}
        <div style={{ display: 'flex', alignItems: 'center', flex: 1, marginLeft: 200, fontSize: 18}}>
          <span style={{ fontSize: '24px' }}>&larr;</span>
          <p style={{ marginLeft: '5px', whiteSpace: 'nowrap' }}>Towards healthy</p>
        </div>

        {/* Right arrow and text */}
        <div style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'flex-end', marginLeft: 20, marginRight: 50}}>
          <p style={{ marginRight: '5px', whiteSpace: 'nowrap', fontSize: 18 }}>Towards MCI</p>
          <span style={{ fontSize: '24px' }}>&rarr;</span>
        </div>
      </div>

      <Bar data={data} options={options} ref={chartRef} />
    </div>
  );
};

export default DivergingBarChart;
