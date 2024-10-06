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
import Tutorial from './components/Tutorial'; // Import your tutorial component

const App = () => {
  const location = useLocation();

  // Paths where the sidebar should not appear
  const hideSidebarPaths = ['/login', '/signup', '/patients'];

  // Check if the current path is one of the paths where the sidebar should be hidden
  const shouldShowSidebar = !hideSidebarPaths.includes(location.pathname);

  // State to control when the tutorial is shown
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  // Show tutorial on specific pages (example: /overview)
  useEffect(() => {
    if (location.pathname === '/overview') {
      setShowTutorial(true); // Trigger tutorial
      setTutorialStep(0); // Start from step 0 on overview page
    }
    else if (location.pathname === '/digital-biomarkers' && location.state?.tutorialStep) {
      setShowTutorial(true); // Trigger tutorial on the digital biomarkers page
      setTutorialStep(location.state.tutorialStep); // Continue from the passed step
    } else {
      setShowTutorial(false); // Hide tutorial if not on these pages
    }
  }, [location]);

  return (
    <>
      {shouldShowSidebar && <NavbarComponent />}
      {shouldShowSidebar && <SidebarComponent />}
      
      {/* Render the tutorial if showTutorial is true */}
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
