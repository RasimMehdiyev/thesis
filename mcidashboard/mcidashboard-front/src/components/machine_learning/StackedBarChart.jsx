import React from 'react'; 
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';

Chart.register(ChartDataLabels);

const getTransparentColor = (color, alpha) => {
  const [r, g, b] = color.match(/\w\w/g).map((hex) => parseInt(hex, 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const StackedBarChart = ({ dataSets, maxRange = 100, showLegend = true, padding = 20 }) => {
  const baseColor = '#7B61FF'; 

  const data = {
    labels: [''], 
    datasets: dataSets.map((dataSet, index) => ({
      label: dataSet.label,
      data: [dataSet.data], 
      backgroundColor: getTransparentColor(baseColor, index * 0.2 + 0.2),
      barThickness: 30,
    })),
  };

  const options = {
    maintainAspectRatio: false, 
    indexAxis: 'y', 
    layout: {
      padding: {
        top: showLegend ? 0 : padding,
        bottom: 0,
      },
    },
    plugins: {
      legend: {
        display: showLegend, 
        position: 'top', 
        labels: {
          boxWidth: 15, 
          padding: 5, 
        },
      },
      datalabels: {
        display: true, 
        formatter: (value, context) => {
          const total = context.chart.data.datasets.reduce((acc, dataset) => acc + dataset.data[0], 0);
          const percentage = (value / total) * 100;
          const chartWidth = context.chart.width;
          const barWidth = (value / maxRange) * chartWidth;

          return barWidth > 30 ? (percentage % 1 === 0 ? `${percentage.toFixed(0)}%` : `${percentage.toFixed(1)}%`) : '';
        },
        color: '#000', 
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
        max: maxRange, 
        stacked: true, 
        ticks: {
          stepSize: maxRange / 5, 
          display: false, 
        },
        grid: {
          display: false, 
          drawBorder: false, 
        },
        border: {
          display: false, 
        },
      },
      y: {
        stacked: true, 
        ticks: {
          display: false, 
        },
        grid: {
          display: false, 
          drawBorder: false, 
        },
        border: {
          display: false, 
        },
      },
    },
  };

  const containerHeight = showLegend ? '110px' : '145px';

  return (
    <div style={{ height: containerHeight, width: '100%', zoom: 1.33, maxWidth: '400px' }}> 
      <Bar data={data} options={options} />
    </div>
  );
};

export default StackedBarChart;