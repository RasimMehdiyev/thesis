import { useState, useEffect } from 'react';
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
import Questionnaire from './components/Questionnaire';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const hideSidebarPaths = ['/login', '/signup', '/patients'];
  const shouldShowSidebar = !hideSidebarPaths.includes(location.pathname);

  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  const handleHelpIconClick = () => { 
    setTutorialStep(0);   
    setShowTutorial(true);  
    if (location.pathname !== '/overview') {
      navigate('/overview', { state: { tutorialStep: 0 } }); 
    }  
  };

  // Automatically trigger the help icon on the first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      handleHelpIconClick(); // Trigger the tutorial on the first visit
      localStorage.setItem('hasVisited', 'true'); // Mark as visited
    }
  }, []); // Empty dependency array ensures this runs only on initial load

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


  useEffect(() => {
    if (showTutorial === true) {
      setIsChatboxVisible(false);
    }
    else
    {
      setIsChatboxVisible(true);
    }
  }, [showTutorial]);
  
  const [isChatboxVisible, setIsChatboxVisible] = useState(true);
  const [isQuestionnaireComplete, setIsQuestionnaireComplete] = useState(false);

  const handleQuestionnaireComplete = () => {
    const isCompleteLocalSt = localStorage.getItem('isCompleted');
    if (isCompleteLocalSt === 'true') {
      setIsQuestionnaireComplete(isCompleteLocalSt);
    }
  };


  const toggleChatbox = () => {
    setIsChatboxVisible(!isChatboxVisible);
    console.log('Chatbox Visible?', !isChatboxVisible);
    console.log('Questionnaire Complete?', isQuestionnaireComplete);
  };

  
  return (
    <>
      {!isHomePage && (
        <>
          <NavbarComponent onHelpIconClick={handleHelpIconClick} />
          <SidebarComponent tutorialOpen={showTutorial}/>
          {showTutorial && <Tutorial initialStep={tutorialStep} />}
        </>
      )}
        <div style={{ zoom: "0.67" }}>
          <div className="floating-chat-icon">
            <img
              src={`/static/assets/` + (isChatboxVisible ? 'close-chat-2.svg' : 'chat_icon_2.svg')}
              alt="Chat Icon"
              className="chat-icon"
              title="Start Questionnaire"
              onClick={(e) => {
                toggleChatbox();
                if (window.location.pathname !== '/overview') {
                  navigate('/overview', { state: { tutorialStep: 0 } });
                }
              }}
            />
            {!isChatboxVisible && localStorage.getItem('isCompleted') === 'false' ? (
              <div className="red-dot"></div>
            ) : null}
          </div>
          {isChatboxVisible && (
            <Questionnaire
              onClose={toggleChatbox}
              onQuestionnaireComplete={handleQuestionnaireComplete}
            />
          )}
        </div>
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
