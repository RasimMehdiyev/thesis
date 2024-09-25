import React, { useState, useEffect } from 'react';

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
    <div className="card performance-metrics" style={{ position: 'relative' }}>
      <p className="ml-subtitle" style={{ paddingBottom: '20px' }}>
        Performance metrics
      </p>
      <img
        src="/assets/confusion matrix.png"
        alt="Performance Metrics"
        style={{ width: '100%', height: 'auto' }}
      />
      {/* Bottom Left Hover Area */}
      <div
        className="hover-area"
        style={{
          position: 'absolute',
          top: '315px',
          left: '130px',
          width: '28%',
          height: '9%',
          //For debugging
          //backgroundColor: 'rgba(255, 0, 0, 0.3)', 
          //border: '1px solid red', 
        }}
        onMouseEnter={(e) =>
          handleMouseEnter(
            e,
            'The bottom-left cell shows the number of MCI patients that were <strong>incorrectly</strong> predicted as being healthy by the model.'
          )
        }
        onMouseLeave={handleMouseLeave}
      ></div>

      {/* Bottom Right Hover Area */}
      <div
        className="hover-area"
        style={{
          position: 'absolute',
          top: '22.5%',
          left: '52%',
          width: '29%',
          height: '9%',
          //For debugging
          //backgroundColor: '#00FF007F',
          //border: '1px solid red', 
        }}
        onMouseEnter={(e) =>
          handleMouseEnter(
            e,
            'The bottom-right cell shows the number of MCI that were <strong>correctly</strong> predicted as being MCI patients by the model.'
          )
        }
        onMouseLeave={handleMouseLeave}
      ></div>

      {/* Top Right Hover Area */}
      <div
        className="hover-area"
        style={{
          position: 'absolute',
          top: '13%',
          left: '52%',
          width: '29%',
          height: '9%',
          //For debugging
          //backgroundColor: 'rgba(255, 0, 0, 0.3)', 
          //border: '1px solid red', 
        }}
        onMouseEnter={(e) =>
          handleMouseEnter(e, 'The top-right cell shows the number of healthy participants that were <strong>incorrectly</strong> predicted as being MCI patients by the model.')
        }
        onMouseLeave={handleMouseLeave}
      ></div>

      {/* Top Left Hover Area */}
      <div
        className="hover-area"
        style={{
          position: 'absolute',
          top: '13%',
          left: '23%',
          width: '29%',
          height: '9%',
          //For debugging
          //backgroundColor: '#00FF007F', 
          //border: '1px solid red', 
        }}
        onMouseEnter={(e) =>
          handleMouseEnter(e, 'The top-left cell shows the number of healthy participants that were <strong>correctly</strong> predicted as being healthy by the model.')
        }
        onMouseLeave={handleMouseLeave}
      ></div>

      {/* Custom Tooltip */}
      {/* Now the tooltip won't display if the window width is below 1500px */}
      {tooltip.visible && windowWidth >= 1500 && (
        <div
          className="custom-tooltip"
          style={{
            position: 'absolute',
            top: `${tooltip.y + 300}px`,
            left: `${tooltip.x-100}px`,
            backgroundColor: 'white',
            width: '200px',
            color: 'black',
            padding: '10px',
            borderRadius: '15px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)', 
            transform: 'translate(0, -100%)', // Position the tooltip above the mouse
            zIndex: 10, // Make sure tooltip stays above other content
          }}
          dangerouslySetInnerHTML={{ __html: tooltip.text }} // Renders HTML for bolding "incorrectly"
        ></div>
      )}
    </div>
  );
};

export default PerformanceMetrics;