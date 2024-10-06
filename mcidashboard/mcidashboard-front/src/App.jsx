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

  // Paths where the sidebar should not appear
  const hideSidebarPaths = ['/login', '/signup','/patients'];

  // Check if the current path is one of the paths where the sidebar should be hidden
  const shouldShowSidebar = !hideSidebarPaths.includes(location.pathname);

  // State to control when the tutorial is shown
  const [showTutorial, setShowTutorial] = useState(false);

  // Show tutorial on specific pages (example: /overview)
  useEffect(() => {
    if (location.pathname === '/overview' || location.pathname === '/home') {
      setShowTutorial(true); 
    } else {
      setShowTutorial(false);
    }
  }, [location]);

  return (
    <>
      {shouldShowSidebar && <NavbarComponent />}
      {shouldShowSidebar && <SidebarComponent />}
    
      {showTutorial && <Tutorial />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/overview' element={<Overview/>}></Route>
        <Route path='/digital-biomarkers' element={<DigitalBiomarkersPage/>}></Route>
        <Route path='/machine-learning' element={<MachineLearningPage/>}></Route>
      </Routes>
    </>
  );
};

export default App;
