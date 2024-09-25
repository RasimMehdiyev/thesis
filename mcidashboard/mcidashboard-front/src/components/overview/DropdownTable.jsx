import React, { useState, useEffect, useRef } from 'react';

const DropdownTable = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Total Moves');
  const dropdownRef = useRef(null);


  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  
  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false); // Close the dropdown after selecting
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const options = [
    ['Score', 'Beta Error', 'Min Total Time'],
    ['Accuracy', 'Final Beta Error', 'SD Total Time'],
    ['Game Time', 'Average Think Time', 'Average Accuracy'],
    ['Successful Move', 'Min Think Time', 'SD Accuracy'],
    ['Erroneous Move', 'SD Think Time', 'Min Accuracy'],
    ['Rank Error', 'Average Move Time', 'Max Accuracy'],
    ['Suit Error', 'Min Move Time', 'Taps'],
    ['Pile Move', 'SD Move Time', ''],
    ['Cards Moved', 'Average Total Time', ''],
  ];

  return (
    <div className="dropdown-table-container" ref={dropdownRef}>
      
      <div className="dropdown-header" onClick={handleToggle}>
        <span>{selectedOption}</span>
        <span className="dropdown-arrow">▼</span>
      </div>

      
      {isOpen && (
        <div className="table-container">
          <table className="metrics-table">
            <tbody>
              {options.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((option, colIndex) => (
                    <td
                      key={colIndex}
                      className="dropdown-table-item"
                      onClick={() => handleOptionClick(option)}
                    >
                      {option}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DropdownTable;