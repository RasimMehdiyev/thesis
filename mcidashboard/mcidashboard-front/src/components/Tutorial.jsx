import React, { useState, useEffect, useRef } from 'react';   
import { useNavigate, useLocation } from 'react-router-dom';
import Tooltip from './Tooltip'; // Adjust the path accordingly
import TutorialModal from './TutorialModal';

const tutorialSteps = [
  {//0
    title: "START OF THE TUTORIAL",
    content: "Welcome to the <strong>Solitaire Decision Support System!</strong><br>Click 'Next' to start the tutorial.",
    selector: null, // No highlight for the first step, full overlay
  },
  {//1
    title: "OVERVIEW TAB",
    content: "This tab displays all the information related to a given patient.",
    selector: '.container', // Highlight the container class
  },
  {//2
    title: "OVERVIEW TAB",
    content: "You can find it by clicking the <strong>Overview</strong> tab in the navigation bar at the top of the page.",
    selector: '.navbar', // Highlight the container class
  },
  {//3
    title: "SIDEBAR",
    content: "To view a patient's data on the 'Overview' page, simply <strong>click their name </strong> from the list. <br><br>If you can't find them, use the search bar to quickly locate them by <strong> typing their name. </strong>",
    selector: '.sidebar', // Highlight the sidebar class
  },
  {//4
    title: "PERSONAL INFORMATION",
    content: "On this section of the 'Overview' page, you can view <strong>basic information</strong> about the patient, their <strong>clinical test results</strong> for MCI, and their <strong>self-reported information</strong> on any previous diagnoses of anxiety or depression. ",
    selector: '#pers-card', // Highlight the personal information section
  },
  {//5
    title: "DIGITAL BIOMARKERS",
    content: "In this section of the 'Overview page', you can view how the patient has scored on <strong>each digital biomarker</strong> used for predicting MCI, track the <strong>evolution</strong> of these scores over time, and <strong>compare</strong> them to the scores of other patients. ",
    selector: '#dig-card', // Highlight the digital biomarkers section
  },
  {//6
    title: "DROPDOWN MENUS",
    content: "To view results for <strong>another biomarker</strong>, simply click on this dropdown menu, select your desired biomarker from the options, and all graphs will update accordingly.",
    selector: '.dropdown-header', // Highlight the digital biomarkers section
  },
  {//7
    title: "DROPDOWN MENUS",
    content: "Similarly, you can adjust the <strong>time frame</strong> to view the progress of the results for the selected biomarker on the purple line chart using the dropdown menu above it.",
    selector: '.dropdown-container', // Highlight the digital biomarkers section
  },
  {//8
    title: "FEATURE IMPORTANCE",
    content: "This shows how the <strong>most impactful biomarkers</strong> either increase or decrease the likelihood of the final prediction.",
    selector: '#importance-card', // Highlight the feature importance section
  },
  {//9
    title: "MACHINE LEARNING MODEL",
    content: "This final section of the 'Overview page' displays the <strong>type, quantity and origin of the data </strong> used to develop machine learning models able to predict MCI. <br><br>Most importantly, it provides the <strong>most accurate prediction </strong> for a given patient, along with the associated probability. ",
    selector: '#ml-card', // Highlight the feature importance section
  },
  {//10
    title: "DIGITAL BIOMARKERS DEATAILS TAB",
    content: "If you want more information about the digital biomarkers used for the prediction, switch to the <strong>Digital Biomarkers Details </strong> tab.",
    selector: '.navbar', // Highlight the feature importance section
  },
  {//11
    title: "DIGITAL BIOMARKERS DEATAILS TAB",
    content: "This tab explains the <strong>meaning</strong> of each biomarker, how it is derived from the patient playing <strong>Klondike Solitaire</strong>, its <strong>unit</strong> of measurement, and what <strong>category</strong> it falls into.",
    selector: '.container', // Highlight the feature importance section
  },
  {//12
    title: "MACHINE LEARNING DETAILS TAB",
    content: "If you want more information about the machine learning models developed to make the prediction, switch to the <strong>Machine Learning Details </strong> tab.",
    selector: '.navbar', // Highlight the feature importance section
  },
  {//13
    title: "MACHINE LEARNING DETAILS TAB",
    content: "This tab showcases the <strong>most accurate machine learning models</strong> developed for predicting MCI, along with their <strong>performance metrics</strong>, <strong>key techniques</strong> used in their development, and detailed <strong>demographic information</strong> about the patients whose biomarkers contributed to building these models.",
    selector: '.machine-learning-container', // Highlight the feature importance section
  },
  {//14
    title: "CHARTS",
    content: "Keep in mind that by <strong> moving your mouse over </strong>the different parts of the charts contained on this page, details will appear about what each color represents.",
    selector: '.machine-learning-container', // Highlight the feature importance section
  },

  {//15
    title: "INFO ICONS",
    content: "Similarly, if you <strong>move your mouse over those icons</strong> that can be found on all pages, you will see additional information about the section it is next to. <br> <br> Make sure you try them after this tutorial!",
    selector: '.icon', // Highlight the feature importance section
  },
  {//16
    title: "DONE",
    content: "That's it! You are back on the <strong>Overview page</strong> and ready to use the web app.",
    selector: null, // No highlight for the last step
  },
];

const Tutorial = ({ initialStep = 0 }) => {
    const [currentStep, setCurrentStep] = useState(initialStep); // Set the initial step from props
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false); // State to manage modal visibility
    const step = tutorialSteps[currentStep];
  
    const navigate = useNavigate();
  
    const location = useLocation();
  

  // Set the current step from location state if available
  useEffect(() => {
    if (location.state && location.state.tutorialStep) {
      setCurrentStep(location.state.tutorialStep);
    }
  }, [location.state]);


  // Function to get the mask styles around a given element
  const getMaskStyles = (selector, padding = 0) => {
    if (!selector) {
      // Full-page overlay for steps without a specific selector
      return {
        topMask: { top: 0, left: 0, width: '100vw', height: '100vh' },
        leftMask: { display: 'none' },
        rightMask: { display: 'none' },
        bottomMask: { display: 'none' },
      };
    }
  
    const element = document.querySelector(selector);
    if (!element) return {};
  
    const rect = element.getBoundingClientRect();

    const handleSkip = () => {
        setIsModalVisible(false); // Hide the modal when skipped
        enableScroll(); // Enable scrolling
      };

  
    // Increase the highlighted area by applying the padding
    return {
        topMask: {
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: `${rect.top - padding}px`, // Adjust this for the top overlay
        },
        leftMask: {
          position: 'fixed',
          top: `${rect.top - padding}px`,
          left: 0,
          width: `${rect.left - padding}px`,
          height: `${rect.height + 2 * padding}px`,
        },
        rightMask: {
          position: 'fixed',
          top: `${rect.top - padding}px`,
          left: `${rect.right + padding}px`,
          width: `calc(100vw - ${rect.right + padding}px)`,
          height: `${rect.height + 2 * padding}px`,
        },
        bottomMask: {
          position: 'fixed',
          top: `${rect.bottom + padding}px`,
          left: 0,
          width: '100vw',
          height: `calc(100vh - ${rect.bottom + padding}px)`,
        },
      };
    };

    const handleSkip = () => {
        setIsModalVisible(false); // Hide the modal when skipped
        enableScroll();
      };

  const [maskStyles, setMaskStyles] = useState(getMaskStyles(step.selector));

  // Function to disable/enable scroll
  const disableScroll = () => {
    document.body.style.overflow = 'hidden';
  };

  const enableScroll = () => {
    document.body.style.overflow = 'auto';
  };

  // Scroll to element if it's out of view
  const scrollToElement = (selector) => {
    const element = document.querySelector(selector);
    if (element) {
      const rect = element.getBoundingClientRect();
      const isInView = rect.top >= 0 && rect.bottom <= window.innerHeight;
  
      // Only scroll if the element is out of view
      if (!isInView) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  // Recalculate mask styles after scrolling
  const updateMaskAfterScroll = (selector) => {
    setTimeout(() => {
      setMaskStyles(getMaskStyles(selector));
      setTimeout(() => setIsModalVisible(true), 460); // Show modal with 500ms delay
    }, 400); // Adding a small delay to wait for the scroll animation to complete
  };

  useEffect(() => {
    const updateMaskStyles = () => {
      setIsModalVisible(false); // Hide the modal before recalculating mask
  
      if (currentStep === 13 || currentStep === 11 || currentStep===1) { // Step 11 is index 10 (zero-indexed)
        enableScroll(); // Enable scrolling for Step 11
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Reset scroll to top
        setTimeout(() => {
          // Ensure mask update happens after scroll is complete
          if (step.selector) {
            const element = document.querySelector(step.selector);
            if (element) {
              setMaskStyles(getMaskStyles(step.selector));
              setIsModalVisible(true); // Show modal after scroll and mask update
            }
          }
        }, 500); // Add a delay to ensure the scroll is complete
      } else {
        disableScroll(); // Disable scrolling for all other steps
  
        // Default behavior for all other steps
        if (step.selector) {
          const element = document.querySelector(step.selector);
  
          // Check if the element is already in view, only scroll if necessary
          if (element) {
            const rect = element.getBoundingClientRect();
            const isInView = rect.top >= 0 && rect.bottom <= window.innerHeight;
  
            if (!isInView) {
              // Scroll only if the element is out of view
              scrollToElement(step.selector);
            }
            updateMaskAfterScroll(step.selector); // Update the mask after scrolling
          }
        } else {
          // Full overlay if no selector
          setMaskStyles(getMaskStyles(step.selector));
          setTimeout(() => setIsModalVisible(true), 500); // Show modal after delay
        }
      }
    };
  
    updateMaskStyles();
  
    // Listen for window resize
    window.addEventListener('resize', updateMaskStyles);
  
    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', updateMaskStyles);
      enableScroll(); // Ensure scrolling is enabled when the tutorial ends
    };
  }, [step.selector, currentStep]);
  
  

  // Calculate the tooltip position whenever the step changes
  useEffect(() => {
    if (step.selector) {
      const element = document.querySelector(step.selector);
      if (element) {
        const rect = element.getBoundingClientRect();
        setTooltipPosition({
          top: rect.top + rect.height / 2, // Vertically center it
          left: rect.right + 10, // Place it 10px to the right of the element
        });
        setIsTooltipVisible(true);
      }
    } else {
      setIsTooltipVisible(false);
    }
  }, [currentStep]);

  // Determine the modal's position based on the current step
  // Determine the modal's position based on the current step
  const getModalPosition = () => {
    // Default position: center
    let top = '50%';
    let left = '50%';

    // For specific steps, move the modal to different locations
    if (currentStep === 4) {
      top = '200px';   // Move the modal a bit higher
      left = '800px';  // Move the modal more to the right
    }
    else if(currentStep===3){
        top = '200px';   // Move the modal lower
        left = '450px'; 
    }
    else if(currentStep===5 || currentStep===6 || currentStep===7){
        left = '300px';
    }
    else if(currentStep===8)
    {
        left= '1000px';
    }
    else if(currentStep===9)
    {
        left= '500px';
    }
    else if(currentStep===10){
        top = '200px';   // Move the modal lower
    }

    else if(currentStep===2){
        top = '200px';   // Move the modal lower
        left = '450px'; 
    }
    else if(currentStep===12){
        top = '200px';   // Move the modal lower
        left = '900px';
    }
    // Add any custom positions you want for other steps here

    return { top, left };
  };


  
  const handleNext = () => {
    if (currentStep < tutorialSteps.length-1) {
      setCurrentStep(currentStep + 1);

      if (currentStep === 10) {  // Step 7 is index 6 (zero-indexed)
        navigate('/digital-biomarkers', { state: { tutorialStep: 11 } });
      }
      if (currentStep === 12) {  // Step 7 is index 6 (zero-indexed)
          navigate('/machine-learning', { state: { tutorialStep: 13} });
      }
      
      if (currentStep === 15) {  // Step 7 is index 6 (zero-indexed)
          navigate('/overview', { state: { tutorialStep: 16 } });
      }
    }
    else{
        setIsModalVisible(false); 
        enableScroll(); 
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
    if(currentStep === 10)
    {
        navigate('/overview', { state: { tutorialStep: 9 } });
    }
    if (currentStep === 11) {  // Step 7 is index 6 (zero-indexed)
        navigate('/digital-biomarkers', { state: { tutorialStep: 10 } });
      }
    if (currentStep === 12) {  // Step 7 is index 6 (zero-indexed)
        navigate('/machine-learning', { state: { tutorialStep: 11 } });
    }
    
  };

  return (
    <div>
        {isModalVisible && (
        <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0)', // Transparent but blocks interaction
          zIndex: 1000, // Ensure this is below the modal but above other content
          pointerEvents: 'all', // Block interaction with everything
        }}
      />)}
      {/* Overlay for the mask */}
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

      {/* Conditionally adjust the modal position based on the current step */}
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
             top={getModalPosition().top}   // Pass the top position
             left={getModalPosition().left} // Pass the left position
           />
         )}
          
          </div>
        
      )}
    </div>
  );
};

export default Tutorial;
