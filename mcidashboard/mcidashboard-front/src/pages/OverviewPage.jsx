import React from 'react';
import { useLocation } from 'react-router-dom';
import PersonalInformation from '../components/PersonalInformation';

const OverviewPage = () => {
  const location = useLocation();
  const patient = location.state?.patient;  // Get the patient data passed from SidebarComponent

  if (!patient) {
    return <div className='container'>No patient selected</div>;  // Fallback if no patient data is available
  }

  return (
    <div className='container'>
      <PersonalInformation patient={patient} />
    </div>
  );
}

export default OverviewPage;
