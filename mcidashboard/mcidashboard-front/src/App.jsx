import { useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

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
  const navigate = useNavigate();

 
  const hideSidebarPaths = ['/login', '/signup', '/patients'];
  const shouldShowSidebar = !hideSidebarPaths.includes(location.pathname);


  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);


  const handleHelpIconClick = () => {
    if (location.pathname !== '/overview') {
      navigate('/overview', { state: { tutorialStep: 0 } }); 
    }
    
    setShowTutorial(true);   
    setTutorialStep(0);     
  };

  // Check if the current path is the home page
  const isHomePage = location.pathname === '/' || location.pathname === '/home';

  useEffect(() => {
    const isICFConfirmed = localStorage.getItem('ICFConfirmed') === 'true';

    // Redirect to /overview if the user has already confirmed ICF and tries to access the home page
    if (isICFConfirmed && isHomePage) {
      navigate('/overview');
    }

    // Redirect to home if ICFConfirmed is not true and the user tries to access other pages
    if (!isICFConfirmed && !isHomePage) {
      navigate('/home');
    }
  }, [navigate, isHomePage]);
  
  return (
    <>
      {/* Conditionally render Navbar, Sidebar, and Tutorial only if not on home page */}
      {!isHomePage && (
        <>
          <NavbarComponent onHelpIconClick={() => setShowTutorial(true)} />
          <SidebarComponent />
          {showTutorial && <Tutorial initialStep={tutorialStep} />}
        </>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/digital-biomarkers" element={<DigitalBiomarkersPage />} />
        <Route path="/machine-learning" element={<MachineLearningPage />} />
      </Routes>
    </>
  );
};

export default App;