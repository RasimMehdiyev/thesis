import React, { useState, useEffect } from 'react';
import ConfusionMatrix from './ConfusionMatrix';

const PerformanceMetrics = () => {
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, text: '' });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Update the window width whenever the window is resized
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function to handle mouse enter on specific regions
  const handleMouseEnter = (e, text) => {
    if (windowWidth >= 1500) {  // Show tooltips only if window width is 1500px or above
      const rect = e.target.getBoundingClientRect();
      setTooltip({
        visible: true,
        x: e.clientX - rect.left, // X coordinate within the image
        y: e.clientY - rect.top, // Y coordinate within the image
        text: text,
      });
    }
  };

  // Function to hide the tooltip when mouse leaves the region
  const handleMouseLeave = () => {
    setTooltip({ visible: false, x: 0, y: 0, text: '' });
  };


  return (
    <div className="card performance-metrics" style={{ position: 'relative'}}>
      <p className="ml-subtitle" style={{ paddingBottom: '20px' }}>
        Performance metrics
      </p>

      <ConfusionMatrix data={[ [13, 5],  [2, 16], ]} model={"Gradient Boosting classifier"}/>
      <ConfusionMatrix data={[ [13, 5],  [2, 16], ]} model={"Nu-support Vector classifier"}/>
      <ConfusionMatrix data={[ [13, 5],  [2, 16], ]} model={"Extra Trees classifier"}/>
    
    </div>
  );
};

export default PerformanceMetrics;