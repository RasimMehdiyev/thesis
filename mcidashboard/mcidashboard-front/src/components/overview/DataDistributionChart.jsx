import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels);

const DataDistributionChart = ({ xData, yData, threshold }) => {
  // Divide the data based on the threshold
  const belowThresholdData = yData.map((y, index) => (xData[index] < threshold ? y : null));
  const aboveThresholdData = yData.map((y, index) => (xData[index] >= threshold ? y : null));

  // Ensure the point at the threshold is included in both datasets
  const thresholdIndex = xData.findIndex((x) => x >= threshold);
  if (thresholdIndex !== -1) {
    belowThresholdData[thresholdIndex] = yData[thresholdIndex];
    aboveThresholdData[thresholdIndex] = yData[thresholdIndex];
  }

  const data = {
    labels: xData, 
    datasets: [
      {
        label: 'Below Threshold',
        data: belowThresholdData,
        borderColor: 'rgba(33, 174, 238, 1)', // Blue line for "Below Threshold"
        backgroundColor: 'rgba(33, 174, 238, 0.2)', // Blue area below threshold
        fill: true,
        tension: 0.4, // Curved line
        pointRadius: 0, // Hide points
      },
      {
        label: 'Above Threshold',
        data: aboveThresholdData,
        borderColor: 'rgba(250, 93, 93, 1)', // Red line for "Above Threshold"
        backgroundColor: 'rgba(250, 93, 93, 0.2)', // Red area above threshold
        fill: true,
        tension: 0.4, // Curved line
        pointRadius: 0, // Hide points
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
          drawBorder: false,
          color: 'rgba(0, 0, 0, 0.1)', 
        },
      },
      y: {
        min: 40, 
        max: 80,
        display: false, 
        grid: {
          drawBorder: false,
          color: function (context) {
            // Only draw a line at the max value (80)
            if (context.tick.value === 80) {
              return 'rgba(0, 0, 0, 0.1)'; 
            }
            return null; 
          },
          lineWidth: function (context) {
            return context.tick.value === 80 ? 2 : 0; 
          },
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
        display: function (context) {
          // Only display the data label for the threshold point
          const xValue = context.chart.data.labels[context.dataIndex];
          return xValue === threshold;
        },
        align: 'end', // Align above the threshold point
        anchor: 'end', // Anchor the label at the top
        offset: 10, // Move the label above the line for better visibility
        color: '#000', // Set the color to black
        font: {
          weight: 'bold', // Make the threshold label bold
          size: 14, 
        },
        formatter: function (value) {
          return value; // Show the actual value
        },
      },
      // Add plugin to draw vertical dashed line at threshold
      thresholdLine: {
        afterDatasetsDraw: (chart) => {
          const ctx = chart.ctx;
          const xScale = chart.scales.x;
          const yScale = chart.scales.y;

          // Find the pixel for the threshold value on the x-axis
          const thresholdPixel = xScale.getPixelForValue(threshold);

          // Draw the dashed line
          ctx.save();
          ctx.beginPath();
          ctx.setLineDash([5, 5]); // Set the dash pattern
          ctx.moveTo(thresholdPixel, yScale.top);
          ctx.lineTo(thresholdPixel, yScale.bottom);
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#FA5D5D'; // Red dashed line
          ctx.stroke();
          ctx.restore();
        },
      },
    },
    elements: {
      line: {
        borderWidth: 2, // Adjust the line width
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Line data={data} options={options} plugins={[options.plugins.thresholdLine]} />
    </div>
  );
};

export default DataDistributionChart;
