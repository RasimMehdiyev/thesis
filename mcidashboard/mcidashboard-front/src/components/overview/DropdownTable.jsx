import React, { useState, useEffect, useRef } from 'react';

const DropdownTable = ({ onOptionSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Average Accuracy');
  const dropdownRef = useRef(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    onOptionSelect(option);
  };

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

 
  const biomarkerNametoId = {
    'Average Accuracy': 14,
    'Min Move Time': 24,
    'Beta Error': 10,
    'Average Move Time': 5,
    'Cards Moved': 27,
    'Erroneous Move': 13,
    'Final Beta Error': 11,
    'Game Time': 19,
    'Max Accuracy': 26,
    'Min Accuracy': 25,
    'SD Accuracy': 15,
    'Taps': 16,
    'SD Total Time': 2,
    'Successful Move': 12,
    'Suit Error': 29,
    'SD Think Time': 4,
    'Pile Move': 7,
    'Rank Error': 28,
    'Score': 20,
    'Average Total Time': 1,
    'Average Think Time': 3,
    'Min Think Time': 23,
    'Solved': 21,
    'Min Total Time': 22,
    'SD Move Time': 6,
    'Total Moves': 31
  }

  const options_new = Object.keys(biomarkerNametoId).sort().reduce((acc, key, index) => {
    const rowIndex = Math.floor(index / 4);
    if (!acc[rowIndex]) {
      acc[rowIndex] = [];
    }
    acc[rowIndex].push(key);
    return acc;
  }
  , []);

  console.log('options_new:', options_new);


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
              {options_new.map((row, rowIndex) => (
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
