import React, { useState, useEffect } from 'react';
import Tooltip from '../Tooltip'; 

const PersonalInformation = () => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  // Show tooltip on mouse enter
  const showTooltip = () => {
    setIsTooltipVisible(true);
  };

  // Hide tooltip on mouse leave
  const hideTooltip = () => {
    setIsTooltipVisible(false);
  };


  useEffect(() => {
    printPatientInfo();
  }, []);


  function printPatientInfo() {
    console.log(patient); 
  }


  const patient = {
    username: 'John Doe',
    gender: 'Male',
    age: 45,
    mci: true,
  };

  return (
    <div className='card' id="pers-card">
      
      <div className='personal-info-h' style={{ position: 'relative' }}>
        <p className='ml-subtitle' id="pers-p">Personal Information</p>
        <img
          src='/assets/info_icon.svg'
          alt='Info Icon'
          className='icon'
          onMouseEnter={showTooltip}  // Show tooltip on hover
          onMouseLeave={hideTooltip}  // Hide tooltip when hover ends
          style={{ cursor: 'pointer' }}
        />

        <Tooltip
          content="None of this data was used for predictions as the machine learning models rely entirely on digital biomarkers."
          isVisible={isTooltipVisible}
          top={60}
          left={140}
        />
      </div>

      <div className='info'>
        <h3>Demographics</h3>
        <hr className='horizontal-line' />
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
        <hr className='horizontal-line' />
        <ul className='demographics-list'>
                <li className='demographic-item'>
                <span className='label'><strong>Depression:</strong></span>
                <span className='not-bold value'style={{color: '#21AEEE'}}>No</span>
                </li>
                <li className='demographic-item'>
                <span className='label'><strong>Anxiety:</strong></span>
                <span className='not-bold value'style={{color: '#21AEEE'}}>No</span>
                </li>
            </ul>
      </div>
    </div>
  );
};

export default PersonalInformation;