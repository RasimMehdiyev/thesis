import React from 'react';
import { useLocation } from 'react-router-dom';
import PersonalInformation from '../components/overview/PersonalInformation';
import DigitalBiomarkers from '../components/overview/DigitalBiomarkers';
import FeatureImportance from '../components/overview/FeatureImportance';
import MachineLearningModel from '../components/overview/MachineLearningModel';

const OverviewPage = () => {
  const location = useLocation();

    const patient = location.state?.patient ||{
      full_name: "John Doe",
      gender: "Male",
      age: 45,
      mci: true,
      MMSE: 26,
      MoCA: 22
  };


  return (
    <div className="container">
      <div className="overview-row1">
        <PersonalInformation className="personal-info" patient={patient} />
        <DigitalBiomarkers className="digital-bio" patient={patient}/>
      </div>
      <div className="overview-row2">
        <FeatureImportance className="feature-importance"  />
        <MachineLearningModel className="ML-model" patient = {patient}/>
      </div>
    </div>
  );
}

export default OverviewPage;
