import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels);

const DataDistributionChart = ({ xData, yData, threshold }) => {
  // Helper function to perform linear interpolation
  const interpolate = (x1, y1, x2, y2, x) => {
    return y1 + ((y2 - y1) * (x - x1)) / (x2 - x1);
  };

  // Check if the threshold exists in xData
  let xDataWithThreshold = [...xData];
  let yDataWithThreshold = [...yData];

  const thresholdIndex = xData.findIndex((x) => x === threshold);

  // If threshold is not found, interpolate and insert it
  if (thresholdIndex === -1) {
    // Find the closest points around the threshold
    const indexBefore = xData.findIndex((x) => x < threshold && xData[xData.indexOf(x) + 1] >= threshold);

    if (indexBefore !== -1) {
      const x1 = xData[indexBefore];
      const y1 = yData[indexBefore];
      const x2 = xData[indexBefore + 1];
      const y2 = yData[indexBefore + 1];

      // Interpolate the y-value for the threshold
      const interpolatedY = interpolate(x1, y1, x2, y2, threshold);

      // Insert the threshold point into the data arrays
      xDataWithThreshold.splice(indexBefore + 1, 0, threshold);
      yDataWithThreshold.splice(indexBefore + 1, 0, interpolatedY);
    }
  }

  // Divide the data based on the threshold (no value display on points)
  const belowThresholdData = yDataWithThreshold.map((y, index) => (xDataWithThreshold[index] < threshold ? y : null));
  const aboveThresholdData = yDataWithThreshold.map((y, index) => (xDataWithThreshold[index] >= threshold ? y : null));

  // Ensure the point at the threshold is included in both datasets
  const updatedThresholdIndex = xDataWithThreshold.findIndex((x) => x === threshold);
  if (updatedThresholdIndex !== -1) {
    belowThresholdData[updatedThresholdIndex] = yDataWithThreshold[updatedThresholdIndex];
    aboveThresholdData[updatedThresholdIndex] = yDataWithThreshold[updatedThresholdIndex];
  }

  const data = {
    labels: xDataWithThreshold,
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
          display: true, // Show vertical grid lines
          drawBorder: false,
          color: function (context) {
            const label = context.tick.label;
            if (label === threshold) {
              return '#21AEEE'; // Blue grid line for threshold
            }
            return 'rgba(0, 0, 0, 0.1)'; // Default gray grid line for others
          },
          borderDash: function (context) {
            const label = context.tick.label;
            if (label === threshold) {
              return [5, 5]; // Dashed line for threshold
            }
            return []; // Solid line for other grid lines
          },
          lineWidth: function (context) {
            const label = context.tick.label;
            if (label === threshold) {
              return 3; // Thicker line for the threshold
            }
            return 1; // Default line width for others
          },
        },
        ticks: {
          font: function (context) {
            // Check if the label matches the threshold and apply bold font and increased font size
            if (context.tick.label === threshold) {
              return {
                weight: 'bold', // Make the threshold label bold
                size: 14, // Increase the font size for the threshold label
              };
            }
            return {
              weight: 'normal', // Default label font weight
              size: 10, // Default font size for other labels
            };
          },
          color: function (context) {
            // Change the color of the threshold label to blue
            if (context.tick.label === threshold) {
              return '#21AEEE'; // Blue color for the threshold label
            }
            return 'rgba(0, 0, 0, 1)'; // Default black color for other labels
          },
        },
      },
      y: {
        min: 40,
        max: 80,
        display: false, // Hide the y-axis labels
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
        display: false, // Disable the display of values on all points
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
      <Line data={data} options={options} />
    </div>
  );
};

export default DataDistributionChart;