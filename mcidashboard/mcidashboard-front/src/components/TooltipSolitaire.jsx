import React from 'react';

const Tooltip = ({ content, isVisible, top, left, right, positionStyle }) => {
  if (!isVisible) return null; 

  const finalPositionStyle = {
    ...positionStyle,
    top: top ? `${top}px` : positionStyle.top, 
    left: left ? `${left}px` : positionStyle.left, 
    right: right ? `${right}px` : positionStyle.right,
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
    backgroundColor: 'white',
    color: 'black',
    borderRadius: '15px',
    fontSize: '20px',
    zIndex: '10',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '120px',
    minWidth: '80px',
  },
};

export default Tooltip;