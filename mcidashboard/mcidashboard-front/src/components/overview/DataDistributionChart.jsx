import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels);

const DataDistributionChart = ({ xData, yData, threshold, xUser, swapColors }) => {
  // Helper function to perform linear interpolation
  const interpolate = (x1, y1, x2, y2, x) => {
    return y1 + ((y2 - y1) * (x - x1)) / (x2 - x1);
  };

  // Define the colors based on swapColors prop
  const belowThresholdColor = swapColors ? 'rgba(250, 93, 93, 1)' : 'rgba(33, 174, 238, 1)'; // Red if swapped, else Blue
  const aboveThresholdColor = swapColors ? 'rgba(33, 174, 238, 1)' : 'rgba(250, 93, 93, 1)'; // Blue if swapped, else Red

  // Threshold color set to gray
  const thresholdColor = 'rgba(128, 128, 128, 1)'; // Gray color for threshold

  // Check if the threshold exists in xData
  let xDataWithThreshold = [...xData];
  let yDataWithThreshold = [...yData];

  const thresholdIndex = xData.findIndex((x) => x === threshold);
  const xUserIndex = xData.findIndex((x) => x === xUser);

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

  // Handle xUser even if it's not part of xData
  if (xUserIndex === -1 && xUser !== undefined) {
    // Find the closest points around xUser
    const indexBefore = xData.findIndex((x) => x < xUser && xData[xData.indexOf(x) + 1] >= xUser);

    if (indexBefore !== -1) {
      const x1 = xData[indexBefore];
      const y1 = yData[indexBefore];
      const x2 = xData[indexBefore + 1];
      const y2 = yData[indexBefore + 1];

      // Interpolate the y-value for xUser
      const interpolatedY = interpolate(x1, y1, x2, y2, xUser);

      // Insert xUser into the data arrays
      xDataWithThreshold.splice(indexBefore + 1, 0, xUser);
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

  // Determine the color of the xUser line based on whether it's above or below the threshold
  const xUserColor = xUser < threshold ? belowThresholdColor : aboveThresholdColor; // Color for xUser based on its position

  const data = {
    labels: xDataWithThreshold,
    datasets: [
      {
        label: 'Below Threshold',
        data: belowThresholdData,
        borderColor: belowThresholdColor, // Dynamic color for "Below Threshold"
        backgroundColor: belowThresholdColor.replace('1)', '0.2)'), // Dynamic area color below threshold
        fill: true,
        tension: 0.4, // Curved line
        pointRadius: 0, // Hide points
      },
      {
        label: 'Above Threshold',
        data: aboveThresholdData,
        borderColor: aboveThresholdColor, // Dynamic color for "Above Threshold"
        backgroundColor: aboveThresholdColor.replace('1)', '0.2)'), // Dynamic area color above threshold
        fill: true,
        tension: 0.4, // Curved line
        pointRadius: 0, // Hide points
      },
      {
        label: 'xUser',
        data: yDataWithThreshold.map((y, index) => (xDataWithThreshold[index] === xUser ? y : null)), // Single point for xUser
        borderColor: xUserColor, // Color of xUser
        backgroundColor: xUserColor, // Match background color
        pointRadius: 6, // Large point to highlight xUser
        fill: false, // No fill for xUser
        showLine: false, // No line, just a point
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
              return thresholdColor; // Gray grid line for threshold
            } else if (label === xUser) {
              return xUserColor; // Grid line color for xUser
            }
            return 'rgba(0, 0, 0, 0.1)'; // Default gray grid line for others
          },
          lineWidth: function (context) {
            const label = context.tick.label;
            if (label === threshold) {
              return 2; // Thinner line for the threshold (neutral)
            } else if (label === xUser) {
              return 3; // Thicker line for xUser
            }
            return 1; // Default line width for others
          },
        },
        ticks: {
          font: function (context) {
            const label = context.tick.label;
            if (label === threshold || label === xUser) {
              return {
                weight: 'bold', // Make the threshold and xUser label bold
                size: 14, // Increase the font size for the threshold and xUser label
              };
            }
            return {
              weight: 'normal', // Default label font weight
              size: 10, // Default font size for other labels
            };
          },
          color: function (context) {
            const label = context.tick.label;
            if (label === threshold) {
              return thresholdColor; // Gray color for the threshold label
            } else if (label === xUser) {
              return xUserColor; // Color for the xUser label
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
