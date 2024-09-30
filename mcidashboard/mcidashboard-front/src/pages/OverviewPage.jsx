import React from 'react';
import { useLocation } from 'react-router-dom';
import PersonalInformation from '../components/overview/PersonalInformation';
import DigitalBiomarkers from '../components/overview/DigitalBiomarkers';
import FeatureImportance from '../components/overview/FeatureImportance';
import MachineLearningModel from '../components/overview/MachineLearningModel';

const OverviewPage = () => {
  const location = useLocation();

    const patient = {
      username: "JohnDoe",
      gender: "Male",
      age: 45,
      mci: true,
      // Additional static data can be added here as needed
  };


  return (
    <div className="container">
      <div className="overview-row1">
        <PersonalInformation className="personal-info" patient={patient} />
        <DigitalBiomarkers className="digital-bio"/>
      </div>
      <div className="overview-row2">
        <FeatureImportance className="feature-importance"  />
        <MachineLearningModel className="ML-model"/>
      </div>
    </div>
  );
}

export default OverviewPage;
