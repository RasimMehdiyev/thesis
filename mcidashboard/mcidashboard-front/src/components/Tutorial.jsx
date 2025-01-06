import React, { useState, useEffect } from 'react';   
import { useNavigate, useLocation } from 'react-router-dom';
import TutorialModal from './TutorialModal';

const tutorialSteps = [
  {//0
    title: "START OF THE TUTORIAL",
    content: "Welcome to the <strong>Solitaire Decision Support System!</strong><br>Click 'Next' to start the tutorial.",
    selector: null, 
  },
  {//1
    title: "OVERVIEW TAB",
    content: "This tab displays all the information related to a given patient. Scroll to explore all available details.",
    selector: '.container', 
  },
  {//2
    title: "OVERVIEW TAB",
    content: "You can find it by clicking the <strong>Overview</strong> tab in the navigation bar at the top of the page.",
    selector: '.navbar', 
  },
  {//3
    title: "SIDEBAR",
    content: "To view a patient's data on the 'Overview' page, simply <strong>click their name </strong> from the list. <br><br>If you can't find them, use the search bar to quickly locate them by <strong> typing their name. </strong>",
    selector: '.sidebar', 
  },
  {//4
    title: "PERSONAL INFORMATION",
    content: "On this section of the 'Overview' page, you can view <strong>basic information</strong> about the patient, their <strong>clinical test results</strong> for MCI, and their <strong>self-reported information</strong> on any previous diagnoses of anxiety or depression. ",
    selector: '#pers-card', 
  },
  {//5
    title: "DIGITAL BIOMARKERS",
    content: "In this section of the 'Overview page', you can view how the patient has scored on <strong>each digital biomarker</strong> used for predicting MCI, track the <strong>evolution</strong> of these scores over time, and <strong>compare</strong> them to the scores of other patients. ",
    selector: '#dig-card',
  },
  {//6
    title: "DROPDOWN MENU",
    content: "To view results for <strong>another biomarker</strong>, simply click on this dropdown menu, select your desired biomarker from the options, and all graphs will update accordingly.",
    selector: '.dropdown-header', 
  },
  {//7
    title: "FEATURE IMPORTANCE",
    content: "This shows how the <strong>most impactful biomarkers</strong> either increase or decrease the likelihood of the final prediction.",
    selector: '#importance-card',
  },
  {//8
    title: "MACHINE LEARNING MODEL",
    content: "This final section of the 'Overview page' displays the <strong>type, quantity and origin of the data </strong> used to develop machine learning models able to predict MCI. <br><br>Most importantly, it provides the <strong>most accurate prediction </strong> for a given patient, along with the associated probability. ",
    selector: '#ml-card', 
  },
  {//9
    title: "DIGITAL BIOMARKERS DETAILS TAB",
    content: "You will find more information about the digital biomarkers used for the prediction, by clicking on the <strong>Digital Biomarkers Details </strong> tab.",
    selector: '.navbar',
  },
  {//10
    title: "DIGITAL BIOMARKERS DETAILS TAB",
    content: "This section explains the <strong>meaning</strong> of each biomarker, how it is derived from the patient playing <strong>Klondike Solitaire</strong>, its <strong>unit</strong> of measurement, and what <strong>category</strong> it falls into.",
    selector: '.biomarkers-list', 
  },
  {//11
    title: "SOLITAIRE GAME EXAMPLES",
    content: "Here, you can explore interactive examples by <strong>hovering your mouse over them</strong> to see how certain biomarkers are derived from gameplay data. <br><br> You can scroll through it to give it a try.",
    selector: '.solitaire-animated', 
  },
  {//12
    title: "MACHINE LEARNING DETAILS TAB",
    content: "If you want more information about the machine learning models developed to make the prediction, the <strong>Machine Learning Details </strong> tab is where you will find it.",
    selector: '.navbar', 
  },
  {//13
    title: "MACHINE LEARNING DETAILS TAB",
    content: "This tab showcases the <strong>most accurate machine learning models</strong> developed for predicting MCI, along with their <strong>performance metrics</strong>, <strong>key techniques</strong> used in their development, and detailed <strong>demographic information</strong> about the patients whose biomarkers contributed to building these models.",
    selector: '.container', 
  },
  {//14
    title: "CHARTS",
    content: "Keep in mind that by <strong> moving your mouse over </strong>the different parts of the charts contained on this page, details will appear about what each color represents. <br><br> Feel free to try it before proceeding.",
    selector: '.container', 
  },

  {//15
    title: "INFO ICONS",
    content: "Similarly, if you <strong>move your mouse over those icons</strong> that can be found on all pages, you will see additional information about the section it is next to. <br> <br> You can try it now.",
    selector: '.icon', 
  },
  {//16
    title: "TUTORIAL",
    content: "If you wish to go through the tutorial again, you can do so at anytime by <strong>clicking this icon</strong>.",
    selector: '.help-icon', 
  },
  {//17
    title: "DONE",
    content: "That's it! You are back on the <strong>Overview page</strong> and ready to use the web app.",
    selector: null, 
  },
];

const Tutorial = ({ initialStep = 0 }) => {
    const [currentStep, setCurrentStep] = useState(initialStep); 
    const [isModalVisible, setIsModalVisible] = useState(false); 
    const step = tutorialSteps[currentStep];
    const navigate = useNavigate();
    const location = useLocation();
  
  
  useEffect(() => {
    if (location.state && location.state.tutorialStep) {
      setCurrentStep(location.state.tutorialStep);
      setIsModalVisible(true);
    }
  }, [location.state]);

  
  useEffect(() => { 
    setCurrentStep(0);
  }, []);

  const getMaskStyles = (selector, padding = 0) => {
    if (!selector) {
      return {
        topMask: { top: 0, left: 0, width: '100vw', height: '100vh' },
        leftMask: { display: 'none' },
        rightMask: { display: 'none' },
        bottomMask: { display: 'none' },
      };
    }
  
    const element = document.querySelector(selector);
    console.log("Calculating mask styles for selector:", selector);
    if (!element) return {};
  
    const rect = element.getBoundingClientRect();
  
    return {
        topMask: {
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: `${rect.top}px`,
        },
        leftMask: {
          position: 'fixed',
          top: `${rect.top}px`,
          left: 0,
          width: `${rect.left}px`,
          height: `${rect.height}px`,
        },
        rightMask: {
          position: 'fixed',
          top: `${rect.top }px`,
          left: `${rect.right}px`,
          width: `calc(100vw - ${rect.right}px)`,
          height: `${rect.height}px`,
        },
        bottomMask: {
          position: 'fixed',
          top: `${rect.bottom}px`,
          left: 0,
          width: '100vw',
          height: `calc(100vh - ${rect.bottom}px)`,
        },
      };
    };

    const handleSkip = () => {
        setIsModalVisible(false); 
        enableScroll();
        window.location.href = '/overview'
      };

  const [maskStyles, setMaskStyles] = useState(getMaskStyles(step.selector));


  const disableScroll = () => {
    document.body.style.overflow = 'hidden';
  };

  const enableScroll = () => {
    document.body.style.overflow = 'auto';
  };

  const scrollToElement = (selector) => {
    const element = document.querySelector(selector);
    if (element) {
      const rect = element.getBoundingClientRect();
      const isInView = rect.top >= 0 && rect.bottom <= window.innerHeight;
  
      if (!isInView) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const updateMaskAfterScroll = (selector) => {
    setTimeout(() => {
      setMaskStyles(getMaskStyles(selector));
      setTimeout(() => setIsModalVisible(true), 460); 
    }, 500); 
  };

  useEffect(() => {
    const updateMaskStyles = () => {
      setIsModalVisible(false); 
  
      if (currentStep===1 ||currentStep===10|| currentStep===11 ||currentStep===13 ||currentStep===14 )
      { 
        enableScroll();
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
        setTimeout(() => {
          
          if (step.selector) {
            const element = document.querySelector(step.selector);
            if (element) {
              setMaskStyles(getMaskStyles(step.selector));
              setIsModalVisible(true); 
              console.log("SELECTOR:", step.selector);
            }
          }
        }, 500); 
      } else {
        disableScroll(); 
  
        if (step.selector) {
          const element = document.querySelector(step.selector);
  
          if (element) {
            const rect = element.getBoundingClientRect();
            const isInView = rect.top >= 0 && rect.bottom <= window.innerHeight;
  
            if (!isInView) {
              scrollToElement(step.selector);
            }
            updateMaskAfterScroll(step.selector); 
          }
        } else {
          setMaskStyles(getMaskStyles(step.selector));
          setTimeout(() => setIsModalVisible(true), 500); 
        }
      }
    };
  
    updateMaskStyles();
    window.addEventListener('resize', updateMaskStyles);
  
    
    return () => {
      window.removeEventListener('resize', updateMaskStyles);
      enableScroll(); 

    };
  }, [step.selector, currentStep]);
  
  
  const getModalPosition = () => {
    let top = '50%';
    let left = '50%';
    
    if( currentStep===3 ||currentStep===14){
        top = '200px';  
        left = '450px'; 
    }
    else if (currentStep === 4) {
        top = '200px';   
        left = '800px';  
    }
    else if(currentStep===5 || currentStep===6 || currentStep===11){
        left = '300px';
    }
    else if(currentStep===7)
    {
        left= '1000px';
    }
    else if(currentStep===8)
    {
        left= '500px';
    }
    else if(currentStep===9 || currentStep===12 || currentStep===2){
        top = '200px';  
    }
    else if(currentStep===16){
      top = '180px'; 
      left= '1050px' 
    }
    return { top, left };
  };


  
  const handleNext = () => {
    if (currentStep < tutorialSteps.length-1) {
      setCurrentStep(currentStep + 1);

      if (currentStep === 8) { 
          navigate('/digital-biomarkers', { state: { tutorialStep: 9 } });
      }
      if (currentStep === 11) { 
          navigate('/machine-learning', { state: { tutorialStep: 12} });
      }
      
      if (currentStep === 16) { 
          navigate('/overview', { state: { tutorialStep: 17 } });
      }
    }
    else{ 
        setIsModalVisible(false); 
        enableScroll(); 
        window.location.href = '/overview' 
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
    if(currentStep === 9)
    {
      updateMaskAfterScroll(tutorialSteps[7].selector);
      updateMaskAfterScroll(tutorialSteps[8].selector);
      setTimeout(() => navigate('/overview', { state: { tutorialStep: 8 } }), 100); 
    }
    if (currentStep === 12) {  
        navigate('/digital-biomarkers', { state: { tutorialStep: 11 } });
    }
    if (currentStep === 17) {  
        navigate('/machine-learning', { state: { tutorialStep: 16 } });
    }
  };

  return (
    <div>
        {isModalVisible && currentStep!==6  && currentStep!==11 && currentStep!==14 && currentStep!==15 &&(
        <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0)', 
          zIndex: 1000,
          pointerEvents: 'all', 
        }}
      />)}

        {isModalVisible && (
        <>
             
            <div className="tutorial-overlay" style={{ ...maskStyles.topMask }} />
            {step.selector && (
            <>
                <div className="tutorial-overlay" style={{ ...maskStyles.leftMask }} />
                <div className="tutorial-overlay" style={{ ...maskStyles.rightMask }} />
                <div className="tutorial-overlay" style={{ ...maskStyles.bottomMask }} />
            </>
            )}
        </>
        )}


      {isModalVisible && (
         <div>
         {isModalVisible && (
           <TutorialModal
             stepTitle={step.title}
             content={step.content}
             currentStep={currentStep}
             totalSteps={tutorialSteps.length}
             onNext={handleNext}
             onPrev={handlePrev}
             onSkip={handleSkip}
             top={getModalPosition().top}   
             left={getModalPosition().left} 
           />
         )}
          </div>
      )}
    </div>
  );
};

export default Tutorial;