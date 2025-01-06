import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels);

const GameHistoryLineChart = ({ data, labels, minLimit, maxLimit }) => {

  // console.log('GameHistoryLineChart:', { data, labels, minLimit, maxLimit });

  const chartData = {
    labels: labels, 
    datasets: [
      {
        label: 'Game History',
        data: data, 
        borderColor: '#5A21EB', 
        fill: false, 
        tension: 0.4,
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
        min: minLimit,
        max: maxLimit, 
        grid: {
            display: true, 
            color: (context) => {
                if (context.tick.value === maxLimit) { 
                    return 'rgba(0, 0, 0, 0.1)';
                }
                return 'rgba(0, 0, 0, 0.05)'; 
            },
            lineWidth: (context) => {
                if (context.tick.value === maxLimit) { 
                    return 1; 
                }
                return 0.5; 
            },
        },
        ticks: {
            stepSize: maxLimit/4, 
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
        <p style={{ fontSize: 16 }}>Game history</p>
      </div>
      <div style={{ width: '100%', height: '100%', minWidth: 300 }}>
        <Line data={chartData} options={options} />
      </div>
    </>
  );
};

export default GameHistoryLineChart;
