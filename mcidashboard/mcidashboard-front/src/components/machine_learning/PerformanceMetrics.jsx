import React, { useState, useEffect } from 'react';
import ConfusionMatrix from './ConfusionMatrix';

const PerformanceMetrics = ({topModels, model_names}) => {
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, text: '' });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Function to handle mouse enter on specific regions
  const handleMouseEnter = (e, text) => {
    if (windowWidth >= 1500) { // Show tooltips only if window width is 1500px or above
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
    <div className="card performance-metrics" style={{ position: 'relative', alignItems: 'center' }}>
      <p className="ml-subtitle" style={{ paddingBottom: '20px' }}>
        Performance metrics
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        {topModels.map((model, index) => (
          <ConfusionMatrix
            key={index}
            data={[
              [model.c_matrix.TN, model.c_matrix.FP],
              [model.c_matrix.FN, model.c_matrix.TP]
            ]}
            model={model_names[model.model_name]}
          />
        ))}
      </div>
    </div>
  );
};

export default PerformanceMetrics;
