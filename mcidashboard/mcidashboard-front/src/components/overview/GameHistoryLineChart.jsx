import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const GameHistoryLineChart = () => {
  const data = {
    labels: ['13 Jan', '22 Jan', '26 Jan', '2 Feb', '5 Feb'], // Dates for the x-axis
    datasets: [
      {
        label: 'Game History',
        data: [55, 57, 60, 65, 62, 67, 70], // Data points corresponding to each date
        borderColor: '#673AB7', // Line color (purple)
        fill: false, // Disable filling below the line
        tension: 0.4, // Curve the line
        pointBackgroundColor: '#fff', // Point fill color
        pointBorderColor: '#673AB7', // Point border color (matches the line)
        pointHoverBackgroundColor: '#673AB7', // Point color when hovered
        pointHoverBorderColor: '#fff', // Point border when hovered
        pointRadius: 5, // Point radius
        pointHoverRadius: 6, // Point radius when hovered
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow the chart to grow or shrink to fit its container
    scales: {
      x: {
        grid: {
          display: true, // Show vertical grid lines
          drawBorder: false, // Remove border at the x-axis
          color: 'rgba(0, 0, 0, 0.1)', // Light gray color for grid lines
        },
      },
      y: {
        min: 40, // Set minimum value for y-axis
        max: 80, // Set maximum value for y-axis
        grid: {
          display: true, // Show horizontal grid lines
          color: 'rgba(0, 0, 0, 0.1)', // Light gray color for grid lines
        },
        ticks: {
          stepSize: 10, // Step size between y-axis labels
        },
      },
    },
    plugins: {
      tooltip: {
        enabled: true, // Enable tooltip on hover
      },
      legend: {
        display: false, // Hide legend
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