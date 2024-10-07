import { useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

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

  // Comment out the automatic tutorial logic based on route changes
  // useEffect(() => {
  //   if (location.pathname === '/overview') {
  //     // Start tutorial at step 0 for Overview page
  //     setShowTutorial(true);
  //     setTutorialStep(0); 
  //   } else if (
  //     (location.pathname === '/digital-biomarkers' || location.pathname === '/machine-learning') 
  //     && location.state?.tutorialStep !== undefined // Ensure tutorialStep is passed in state
  //   ) {
  //     // Continue tutorial from passed step on other pages
  //     setShowTutorial(true);
  //     setTutorialStep(location.state.tutorialStep);
  //   } else {
  //     // If on other pages or no tutorial state is passed, hide tutorial
  //     setShowTutorial(false);
  //   }
  // }, [location]);


  const handleHelpIconClick = () => {
    if (location.pathname !== '/overview') {
      navigate('/overview', { state: { tutorialStep: 0 } }); 
    }
    
    setShowTutorial(true);   
    setTutorialStep(0);     
  };

  return (
    <>
      {shouldShowSidebar && (
        <NavbarComponent onHelpIconClick={handleHelpIconClick} /> // Pass the click handler to Navbar
      )}
      {shouldShowSidebar && <SidebarComponent />}


      {showTutorial && <Tutorial initialStep={tutorialStep} />}

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
