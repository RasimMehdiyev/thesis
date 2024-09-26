import React, { useRef, useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register the necessary chart components and the datalabels plugin
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const DivergingBarChart = ({ features, percentages }) => {
  const chartRef = useRef(null);
  const [zeroAxisPosition, setZeroAxisPosition] = useState(null); // Start with null until it's calculated

  const data = {
    labels: features, // Features (e.g., 'Average of Total Moves')
    datasets: [
      {
        label: 'Towards MCI',
        backgroundColor: 'rgba(250, 93, 93, 0.6)', // Light red for "Towards MCI"
        data: percentages.map((value) => (value > 0 ? value : 0)), // Positive values for MCI
        barThickness: 25, // Increase the bar thickness
      },
      {
        label: 'Towards healthy',
        backgroundColor: 'rgba(33, 174, 238, 0.6)', // Light blue for "Towards healthy"
        data: percentages.map((value) => (value < 0 ? value : 0)), // Negative values for healthy
        barThickness: 25, // Increase the bar thickness
      },
    ],
  };

  const options = {
    indexAxis: 'y', // Horizontal bars
    layout: {
      padding: {
        left: 30, // Add padding to the left (space before the y-axis labels)
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        min: -12, // Adjust the minimum value on the x-axis
        max: 12,  // Adjust the maximum value on the x-axis
        grid: {
          display: true, // Enable vertical grid lines
          color: 'rgba(0, 0, 0, 0.1)', // Light gray color for vertical grid lines
        },
        ticks: {
          display: false, // Hide ticks and labels on the x-axis
        },
      },
      y: {
        display: true, // Show the y-axis labels
        grid: {
          display: true, // Keep horizontal grid lines
          color: 'rgba(0, 0, 0, 0.1)', // Light gray color for horizontal grid lines
        },
        ticks: {
          color: '#000',
          font: {
            family: 'Poppins', // Use Poppins font for the labels
            size: 15, // Adjust the font size
            weight: '500', // Semi-bold
          },
          padding: 30, // Add space between the labels and the bars
          autoSkip: false, // Ensure all labels are displayed
          maxRotation: 0, // Ensure labels are displayed horizontally
          minRotation: 0,
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.raw}%`, // Custom tooltip to display percentage
        },
      },
      datalabels: {
        display: true, // Show the data labels (percentages)
        color: '#000', // Set the color of the labels
        anchor: (context) => (context.datasetIndex === 0 ? 'end' : 'start'), // Anchor positive values at the end, negative at the start
        align: (context) => (context.datasetIndex === 0 ? 'right' : 'left'), // Align positive percentages to the right, negative to the left
        font: {
          family: 'Poppins', // Set Poppins as the font for the data labels
          size: 12, // Font size for the percentage labels
          weight: '500', // Semi-bold
        },
        formatter: (value) => (value !== 0 ? `${value}%` : ''), // Only show non-zero values
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  useEffect(() => {
    const chartInstance = chartRef.current;

    if (chartInstance && chartInstance.scales && chartInstance.scales.x) {
      // Dynamically calculate the 0% axis position
      const zeroPosition = chartInstance.scales.x.getPixelForValue(0);
      setZeroAxisPosition(zeroPosition);
    }
  }, [chartRef.current]); // Re-run when the chart reference changes

  return (
    <div style={{ width: '95%', height: '500px', position: 'relative' }}>
      {/* Conditionally render the arrows only when the zero axis position is calculated */}
      {zeroAxisPosition !== null && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            marginTop: '20px',
            top: '-30px',
            left: `${zeroAxisPosition}px`, // Dynamically position around the 0% axis
            transform: 'translateX(-50%)', // Center the arrows
            pointerEvents: 'none', // Prevent blocking the chart interactions
            whiteSpace: 'nowrap', // Prevent text from wrapping to the next line
          }}
        >
          {/* Left arrow and text */}
          <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px', marginLeft: '5px' }}>
            <span style={{ fontSize: '24px' }}>&larr;</span>
            <p style={{ marginLeft: '10px' }}>Towards healthy</p>
          </div>

          {/* Right arrow and text */}
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '20px', marginRight:'5px' }}>
            <p style={{ marginRight: '10px' }}>Towards MCI</p>
            <span style={{ fontSize: '24px' }}>&rarr;</span>
          </div>
        </div>
      )}

      {/* Bar chart */}
      <Bar data={data} options={options} ref={chartRef} />
    </div>
  );
};

export default DivergingBarChart;