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
import LogRocket from 'logrocket';

// LogRocket.init('znlset/solitaire-dss');

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    LogRocket.init('znlset/solitaire-dss');
  }, []);

  const hideSidebarPaths = ['/login', '/signup', '/patients'];
  const shouldShowSidebar = !hideSidebarPaths.includes(location.pathname);
  const [isChatboxVisible, setIsChatboxVisible] = useState(true);
  const [isQuestionnaireComplete, setIsQuestionnaireComplete] = useState(false);
  const [isICFConfirmedGlobal, setIsICFConfirmedGlobal] = useState(localStorage.getItem('ICFConfirmed') === 'true');
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  const handleHelpIconClick = () => { 
    setTutorialStep(0);   
    setShowTutorial(true);  
    if (location.pathname !== '/overview') {
      navigate('/overview', { state: { tutorialStep: 0 } }); 
    }  
  };

 
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      handleHelpIconClick(); 
      localStorage.setItem('hasVisited', 'true'); 
    }
  }, []); 

  const isHomePage = location.pathname === '/' || location.pathname === '/home';

  useEffect(() => {
    const isICFConfirmed = localStorage.getItem('ICFConfirmed') === 'true';
    console.log('isICFConfirmed:', isICFConfirmed);
    if (isICFConfirmed && isHomePage) {
      navigate('/overview');
    }

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

      {
        isICFConfirmedGlobal && (
          <div style={{ zoom: "0.67" }}>
          <div className="floating-chat-icon">
            <img
              src={`/static/assets/` + (isChatboxVisible ? 'close-chat-2.svg' : 'chat_icon_2.svg')}
              alt="Chat Icon"
              className="chat-icon"
              title="Start Questionnaire"
              onClick={(e) => {
                toggleChatbox();
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
        )
      }

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
