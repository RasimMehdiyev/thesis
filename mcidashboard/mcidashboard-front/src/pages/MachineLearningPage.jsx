//import React, { useState, useEffect } from 'react';
//import { useNavigate } from 'react-router-dom';
import DemographicSummary from '../components/machine_learning/DemographicSummary';
import PerformanceMetrics from '../components/machine_learning/PerformanceMetrics';
import Models from '../components/machine_learning/Models';
import DataPreProcessing from '../components/machine_learning/DataPreProcessing';
import { useState, useEffect } from 'react';


const MachineLearningPage = () => {
  const [topModels, setTopModels] = useState([]);
  const [totalModels, setTotalModels] = useState(0);

  const model_names = {
    "DT": "Decision Tree",
    "RF": "Random Forest",
    "SVC": "Support Vector Classifier",
    "LR": "Logistic Regression",
    "KNN": "K-Nearest Neighbors",
    "MLP": "Multi-Layer Perceptron",
    "XGB": "XGBoost",
    "XGBRFC": "XGBoost Random Forest",
    'GB': 'Gradient Boosting',
    "BAG": "Bagging",
    "ADA": "AdaBoost",
    "ET": "Extra Trees",
    "LSVC": "Linear SVC",
    "SGD": "Stochastic Gradient Descent",
    "QDA": "Quadratic Discriminant Analysis",
    "GPC": "Gaussian Process Classifier",
    "NuSVC": "Nu-Support Vector Classifier",
    "LRCV": "Logistic Regression CV",
    "GNB": "Gaussian Naive Bayes",
  }

  const fetchTopModels = async () => {
    const url = '/dashboard/top-3-models/';
    const jsonURL = '/top3models.json';
  
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched data:', data);
        setTopModels(Array.isArray(data.top_models) ? data.top_models : []); // Access the 'top_models' array
        setTotalModels(data.total_models);
      } else {
        throw new Error('Failed to fetch top models');
      }
    } catch (error) {
      console.error(error);
      try {
        const response = await fetch(jsonURL);
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched data from JSON fallback:', data);
          setTopModels(Array.isArray(data.top_models) ? data.top_models : []); // Access the 'top_models' array
          setTotalModels(data.total_models);
        } else {
          throw new Error('Failed to fetch top models from JSON fallback');
        }
      } catch (jsonError) {
        console.error('Error with fallback fetch:', jsonError);
      }
    }
  };
  

  useEffect(() => {
    fetchTopModels();
  }, []);

  // Print the top 3 models data
  useEffect(() => {
    console.log("Top Models: ", topModels);
    console.log("Total Models: ", totalModels);
  }, [topModels]);


  return (
    <div className="container machine-learning-container">
            <DemographicSummary/>
            <PerformanceMetrics  topModels={topModels} model_names={model_names}/>
            <div className="models-data-container">
                <Models topModels={topModels} model_names={model_names} total_models = {totalModels}/>
                <DataPreProcessing/>
            </div>
    </div>
  )
}

export default MachineLearningPage