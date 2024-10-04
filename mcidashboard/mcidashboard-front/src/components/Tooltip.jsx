import React from 'react';

const Tooltip = ({ content, isVisible, top, left, positionStyle }) => {
  if (!isVisible) return null; 

  const finalPositionStyle = {
    ...positionStyle,
    top: top ? `${top}px` : positionStyle.top, 
    left: left ? `${left}px` : positionStyle.left, 
  };

  return (
    <div className="tooltip" style={finalPositionStyle} dangerouslySetInnerHTML={{ __html: content }}>
    </div>
  );
};


Tooltip.defaultProps = {
  positionStyle: {
    position: 'absolute',
    top: '0px', 
    left: '0px', 
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