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
    ['Accuracy', 'Average Accuracy', 'Average Move Time'],
    ['Average Think Time', 'Average Total Time', 'Beta Error'],
    ['Cards Moved', 'Erroneous Move', 'Final Beta Error'],
    ['Game Time', 'Max Accuracy', 'Min Accuracy'],
    ['Min Move Time', 'Min Think Time', 'Min Total Time'],
    ['Pile Move', 'Rank Error', 'Score'],
    ['SD Accuracy', 'SD Move Time', 'SD Think Time'],
    ['SD Total Time', 'Successful Move', 'Suit Error'],
    ['Taps', 'Total Moves', ''],
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
                      className={`dropdown-table-item ${option === selectedOption ? 'selected-option' : ''}`}
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
