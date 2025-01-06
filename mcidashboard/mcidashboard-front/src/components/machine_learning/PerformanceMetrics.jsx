import React, { useState, useEffect } from 'react';
import ConfusionMatrix from './ConfusionMatrix';

const PerformanceMetrics = ({topModels, model_names}) => {
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, text: '' });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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
