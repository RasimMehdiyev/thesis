import React, { useState, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register necessary components in Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title, ChartDataLabels);

const ConfusionMatrix = ({ model, data: actualData }) => {

  const [tooltip, setTooltip] = useState({ visible: false, text: '', x: 0, y: 0 });
  const chartRef = useRef(null); // Ref to track the chart element

  // Function to get color shade based on the value (higher value = darker color)
  const getColorShade = (value) => {
    const maxValue = Math.max(...actualData.flat()); // Determine max value in the data
    const intensity = Math.floor((value / maxValue) * 255); // Normalize the value to a scale of 0-255
    return `rgba(123, 97, 255, ${intensity / 255})`; // Adjust opacity based on value
  };

  // Prepare the chart data with the actual values and dynamic color shading
  const data = {
    labels: ['Healthy', 'MCI'], // Predicted labels (x-axis)
    datasets: [
      {
        label: 'True Healthy',
        data: [1, 1], // Fake data to ensure equal-sized squares
        backgroundColor: [getColorShade(actualData[0][0]), getColorShade(actualData[0][1])], // Use dynamic shading
        borderWidth: 1,
      },
      {
        label: 'True MCI',
        data: [1, 1], // Fake data to ensure equal-sized squares
        backgroundColor: [getColorShade(actualData[1][0]), getColorShade(actualData[1][1])], // Use dynamic shading
        borderWidth: 1,
      },
    ],
  };

  const handleMouseEnter = (event) => {
    const element = chartRef.current.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);

    if (element.length > 0) {
      const hoveredElement = element[0];
      const datasetIndex = hoveredElement.datasetIndex;
      const index = hoveredElement.index;

      // Generate tooltip message dynamically based on `actualData`
      const value = actualData[datasetIndex][index];
      const isCorrect = (datasetIndex === index); // Diagonal values (correct predictions)
      const label = datasetIndex === 0 ? 'healthy individuals' : 'MCI patients';
      const correctText = isCorrect ? 'correctly' : 'incorrectly';

      const tooltipContent = `There are <strong>${value}</strong> ${label} <strong>${correctText}</strong> classified as ${
        index === 0 ? 'healthy' : 'MCI'
      } by the model.`;

      const x = event.clientX;
      const y = event.clientY;

      setTooltip({
        visible: true,
        text: tooltipContent,
        x,
        y,
      });
    }
  };

  // Handle mouse leave event
  const handleMouseLeave = () => {
    setTooltip({ visible: false, text: '', x: 0, y: 0 });
  };

  const options = {
    indexAxis: 'y', 
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false, 
        },
        ticks: {
          display: false, 
        },
        title: {
          display: true,
          text: 'Predicted Label',
          padding: {
            top: 30, 
          },
        },
      },
      y: {
        stacked: true,
        grid: {
          display: false, 
        },
        title: {
          display: true,
          text: 'True Label',
        },
        ticks: {
          align: 'center', 
          padding: 0, 
        },
      },
    },
    plugins: {
      tooltip: {
        enabled: false, // Disable default tooltips
      },
      title: {
        display: true,
        text: ['Confusion Matrix', model], // Multi-line title: First line is "Confusion Matrix", second line is the model
        align: 'center', 
        font: {
          size: 14,
          family: 'Poppins', 
          weight: 'normal',
        },
        padding: {
          bottom: 10, 
        },
        color: 'black'
        
      },
      legend: {
        display: false,
      },
      datalabels: {
        display: true,
        color: 'black',
        font: {
          weight: 'normal', 
          size: 16,
          family: 'Poppins',
        },
        formatter: (value, context) => {
          // Custom labels for each square based on actual data values
          return actualData[context.datasetIndex][context.dataIndex];
        },
      },
    },
    maintainAspectRatio: false, // Disable aspect ratio to adjust chart size
    categoryPercentage: 1.0, // Ensure the bars take up the entire category space
    barPercentage: 1.0, // Ensure bars take up the entire available space in each category
    onHover: handleMouseEnter, // Handle hover event on chart
  };

  return (
    <div 
      style={{ width: '80%', height: '300px', minWidth: '250px', maxWidth: '400px', zoom: 1.33, position: 'relative', marginBottom: 40 }}
      onMouseLeave={handleMouseLeave}
    >
      <Bar ref={chartRef} data={data} options={options} />
      {/* Custom X-axis labels */}
      <div style={styles.xAxisLabels}>
        <span>Healthy</span>
        <span>MCI</span>
      </div>

      {/* Custom Tooltip */}
      {tooltip.visible && (
        <div
          className="custom-tooltip"
          style={{
            position: 'absolute',
            top: `${tooltip.y + 10}px`,
            left: `${tooltip.x}px`,
            backgroundColor: 'white',
            width: '250px',
            color: 'black',
            padding: '10px',
            borderRadius: '15px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 10, // Ensure the tooltip stays above other content
            transform: 'translate(-50%, -100%)', // Adjust position
          }}
          dangerouslySetInnerHTML={{ __html: tooltip.text }} // Renders HTML for bolding
        ></div>
      )}
    </div>
  );
};

// Style for x-axis labels (manually placed under the bars)
const styles = {
  xAxisLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: '30px',
    left: '130px',
    right: '70px',
    fontSize: '12px',
    fontFamily: 'Helvetica, Arial, sans-serif',
    color: '#666666',
  },
};

export default ConfusionMatrix;

