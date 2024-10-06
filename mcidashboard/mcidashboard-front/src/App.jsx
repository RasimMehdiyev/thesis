import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/authentication_pages/Login';
import Signup from './pages/authentication_pages/Signup';
import Overview from './pages/OverviewPage';
import SidebarComponent from './components/SidebarComponent'; 
import DigitalBiomarkersPage from './pages/DigitalBiomarkersPage';
import MachineLearningPage from './pages/MachineLearningPage';
import NavbarComponent from './components/NavbarComponent'; 
import Tutorial from './components/Tutorial'; 

const App = () => {
  const location = useLocation();

  const hideSidebarPaths = ['/login', '/signup', '/patients'];

  const shouldShowSidebar = !hideSidebarPaths.includes(location.pathname);


  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);


  useEffect(() => {
    if (location.pathname === '/overview') {
      setShowTutorial(true);
      setTutorialStep(0); 
    }
    else if (
      (location.pathname === '/digital-biomarkers' || location.pathname === '/machine-learning') 
      && location.state?.tutorialStep
    ) {
      setShowTutorial(true); 
      setTutorialStep(location.state.tutorialStep); 
    }
    
  }, [location]);

  return (
    <>
      {shouldShowSidebar && <NavbarComponent />}
      {shouldShowSidebar && <SidebarComponent />}
      
      {showTutorial && <Tutorial initialStep={tutorialStep} />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/overview' element={<Overview />} />
        <Route path='/digital-biomarkers' element={<DigitalBiomarkersPage />} />
        <Route path='/machine-learning' element={<MachineLearningPage />} />
      </Routes>
    </>
  );
};

export default App;
