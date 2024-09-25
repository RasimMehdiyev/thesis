import React from 'react';

// Define the Tooltip component, accepting props for content, visibility, and positioning
const Tooltip = ({ content, isVisible, top, left, positionStyle }) => {
  if (!isVisible) return null; 

  // Merge passed `top` and `left` values into the position style
  const finalPositionStyle = {
    ...positionStyle,
    top: top ? `${top}px` : positionStyle.top,  // Use passed top or default
    left: left ? `${left}px` : positionStyle.left, // Use passed left or default
  };

  return (
    <div className="tooltip" style={finalPositionStyle} dangerouslySetInnerHTML={{ __html: content }}>
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
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
};

export default Tooltip;