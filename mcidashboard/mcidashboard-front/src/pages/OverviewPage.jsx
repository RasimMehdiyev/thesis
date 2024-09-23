import React from 'react';
import { useLocation } from 'react-router-dom';
import PersonalInformation from '../components/PersonalInformation';

const OverviewPage = () => {
  const location = useLocation();
  /*const patient = location.state?.patient;  // Get the patient data passed from SidebarComponent

  if (!patient) {
    return <div>No patient selected</div>;  // Fallback if no patient data is available
  }*/

    const patient = {
      username: "JohnDoe",
      gender: "Male",
      age: 45,
      mci: true,
      // Additional static data can be added here as needed
  };


  return (
    <div className='container'>
      <PersonalInformation patient={patient} />
    </div>
  );
}

export default OverviewPage;
