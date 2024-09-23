//import React, { useState, useEffect } from 'react';
//import { useNavigate } from 'react-router-dom';
import DemographicSummary from '../components/machine_learning/DemographicSummary';
import PerformanceMetrics from '../components/machine_learning/PerformanceMetrics';

const MachineLearningPage = () => {



  return (
    <div className="container">
        <div className="machine-learning-container">
        <DemographicSummary/>
        <PerformanceMetrics/>
        </div>
    </div>
  )
}

export default MachineLearningPage