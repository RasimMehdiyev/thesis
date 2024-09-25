import React from 'react';

// Define the Tooltip component, accepting props for content and visibility
const Tooltip = ({ content, isVisible, positionStyle }) => {
  if (!isVisible) return null; 

  return (
    <div className="tooltip" style={positionStyle}>
      {content}
    </div>
  );
};

// Default styles for the tooltip (if not passed through props)
Tooltip.defaultProps = {
  positionStyle: {
    position: 'absolute',
    top: '0px', 
    left: '300px', 
    padding: '15px',
    backgroundColor: '#5200FF',
    color: '#fff',
    borderRadius: '15px',
    fontSize: '16px',
    zIndex: '10',
    width: '200px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
};

export default Tooltip;