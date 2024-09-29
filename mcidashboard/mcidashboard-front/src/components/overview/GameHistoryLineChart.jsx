import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels);

const GameHistoryLineChart = ({ data, labels }) => {
  const chartData = {
    labels: labels, // Use labels passed as prop
    datasets: [
      {
        label: 'Game History',
        data: data, // Use data passed as prop
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
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: true,
          drawBorder: true, 
          color: 'rgba(0, 0, 0, 0.1)', 
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
        display: true,
        align: 'end',
        anchor: 'end',
        offset: 5,
        color: '#000', 
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
      <div style={{ width: '90%', height: '100%' }}>
        <Line data={chartData} options={options} />
      </div>
    </>
  );
};

export default GameHistoryLineChart;