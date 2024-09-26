import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; 

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels); 

const GameHistoryLineChart = () => {
  const data = {
    labels: ['13 Jan', '22 Jan', '26 Jan', '2 Feb', '5 Feb'], 
    datasets: [
      {
        label: 'Game History',
        data: [55, 57, 60, 65, 62, 67, 70], 
        borderColor: '#5A21EB', 
        fill: false, 
        tension: 0.4, // Curve the line
        pointBackgroundColor: '#fff',
        pointBorderColor: '#5A21EB', 
        pointHoverBackgroundColor: '#5A21EB', 
        pointHoverBorderColor: '#fff', 
        pointRadius: 3, 
        pointHoverRadius: 4, 
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow the chart to grow or shrink to fit its container
    scales: {
      x: {
        grid: {
          display: true,
          drawBorder: true, 
          color: 'rgba(0, 0, 0, 0.1)', // Light gray color 
        },
      },
      y: {
        min: 40,
        max: 80, 
        grid: {
          display: false,
        },
        ticks: {
          stepSize: 10, 
        },
      },
    },
    plugins: {
      tooltip: {
        enabled: true, 
      },
      legend: {
        display: false, 
      },
      datalabels: {
        display: true, // Show data labels
        align: 'end', // Align labels above the points
        anchor: 'end', // Anchor them to the top of the points
        offset: 5, // Move them 5px above the points
        color: '#000', // Label color
        font: {
          family: 'Poppins', 
          size: 12, 
          weight: '500', 
        },
        formatter: (value) => value, 
      },
    },
  };

  return (
    <>
      <div className="line-chart-h">
        <p style={{ fontSize: 14 }}>Game history</p>
        <div className="dropdown-container">
          <select className="game-history-dropdown">
            <option>3 months</option>
            <option>6 months</option>
            <option>1 year</option>
          </select>
        </div>
      </div>
      <div style={{ width: '400px', height: '150px' }}>
        <Line data={data} options={options} />
      </div>
    </>
  );
};

export default GameHistoryLineChart;