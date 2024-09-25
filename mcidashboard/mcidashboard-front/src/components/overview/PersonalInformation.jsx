// Import React and useState, useEffect hooks
import React, { useState, useEffect } from 'react';
import Tooltip from '../Tooltip'; // Import the Tooltip component

// Define the PersonalInformation component
const PersonalInformation = () => {
  // State to manage tooltip visibility
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  // Show tooltip on mouse enter
  const showTooltip = () => {
    setIsTooltipVisible(true);
  };

  // Hide tooltip on mouse leave
  const hideTooltip = () => {
    setIsTooltipVisible(false);
  };

  // This useEffect hook is used to call printPatientInfo when the component mounts
  useEffect(() => {
    printPatientInfo();
  }, []);

  // This function prints the patient data in the console
  function printPatientInfo() {
    console.log(patient); // Now it prints the static patient data instead
  }

  // Static patient data
  const patient = {
    username: 'JohnDoe',
    gender: 'Male',
    age: 45,
    mci: true,
  };

  return (
    <div className='card' style={{ width: '30%' }}>
      <div className='personal-info-h' style={{ position: 'relative' }}>
        <p className='ml-subtitle'>Personal Information</p>
        <img
          src='/assets/help_icon.svg'
          alt='Help Icon'
          className='icon'
          onMouseEnter={showTooltip}  // Show tooltip on hover
          onMouseLeave={hideTooltip}  // Hide tooltip when hover ends
          style={{ cursor: 'pointer' }}
        />

        <Tooltip
          content="Neuropsychological tests are clinical results and Self-report Information is based on player’s own weekly report."
          isVisible={isTooltipVisible}
        />
      </div>

      <div className='info'>
        <h3>Demographics</h3>
        <hr className='horizontal-line' />
        <img src={process.env.PUBLIC_URL + '/static/assets/underline.svg'} alt='' />
        <ul className='demographics-list'>
            <li className='demographic-item'>
            <span className='label'><strong>Name:</strong></span>
            <span className='not-bold value'>{patient.username}</span>
            </li>
            <li className='demographic-item'>
            <span className='label'><strong>Gender:</strong></span>
            <span className='not-bold value'>{patient.gender}</span>
            </li>
            <li className='demographic-item'>
            <span className='label'><strong>Age:</strong></span>
            <span className='not-bold value'>{patient.age}</span>
            </li>
        </ul>
        </div>

      <div className='info'>
        
        <div className="test-scores">
        <h3>Neuropsychological Test Score</h3>
        <hr className='horizontal-line' />
        <img src={process.env.PUBLIC_URL + '/static/assets/underline.svg'} alt='' />
            <ul className='demographics-list'>
                <li className='demographic-item'>
                <span className='label'><strong>MMSE:</strong></span>
                <span className='not-bold value'style={{color: '#FA5D5D'}}>26/30</span>
                </li>
                <li className='demographic-item'>
                <span className='label'><strong>MoCA:</strong></span>
                <span className='not-bold value'style={{color: '#FA5D5D'}}>24/30</span>
                </li>
            </ul>
        </div>
      </div>

      <div className='info'>
        <h3>Self-report Assessment</h3>
        <img src={process.env.PUBLIC_URL + '/static/assets/underline.svg'} alt='' />
        <ul></ul>
      </div>
    </div>
  );
};

export default PersonalInformation;