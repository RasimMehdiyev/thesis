//import React, { useState, useEffect } from 'react';
//import { useNavigate } from 'react-router-dom';
import DemographicSummary from '../components/machine_learning/DemographicSummary';
import PerformanceMetrics from '../components/machine_learning/PerformanceMetrics';
import Models from '../components/machine_learning/Models';
import DataPreProcessing from '../components/machine_learning/DataPreProcessing';

const MachineLearningPage = () => {



  return (
    <div className="container machine-learning-container">
            <DemographicSummary/>
            <PerformanceMetrics/>
            <div class="models-data-container">
                <Models/>
                <DataPreProcessing/>
            </div>
    </div>
  )
}

export default MachineLearningPage