import React, { useState, useEffect, useRef } from 'react';   
import { useNavigate, useLocation } from 'react-router-dom';
import Tooltip from './Tooltip'; // Adjust the path accordingly
import TutorialModal from './TutorialModal';

const tutorialSteps = [
  {
    title: "Welcome",
    content: "Welcome to the <strong>Solitaire Decision Support System!</strong><br>Click 'Next' to start the tutorial.",
    selector: null, // No highlight for the first step, full overlay
  },
  {
    title: "Step 2: Container Section",
    content: "This is the main container where content is displayed.",
    selector: '.container', // Highlight the container class
  },
  {
    title: "Step 3: Sidebar Navigation",
    content: "Here you can find the sidebar to navigate between different pages.",
    selector: '.sidebar', // Highlight the sidebar class
  },
  {
    title: "Step 4: Personal Information",
    content: "Here you can view your personal information.",
    selector: '#pers-card', // Highlight the personal information section
  },
  {
    title: "Step 5: Digital Biomarkers",
    content: "These are the digital biomarkers that power our app's features.",
    selector: '#dig-card', // Highlight the digital biomarkers section
  },
  {
    title: "Step 6: Feature Importance",
    content: "These show the most impactful features and the impact of each.",
    selector: '#importance-card', // Highlight the feature importance section
  },
  {
    title: "Step 7: Machine Learning",
    content: "These show dataset information.",
    selector: '#ml-card', // Highlight the feature importance section
  },
  {
    title: "Step 8: Digital biomarkers",
    content: "These show dataset information.",
    selector: '.navbar li:nth-child(2)', // Highlight the feature importance section
  },
  {
    title: "Step 9: Digital biomarkers",
    content: "These show dataset information.",
    selector: '.container', // Highlight the feature importance section
  },
  {
    title: "Step 10: Machine learning",
    content: "These show dataset information.",
    selector: '.navbar li:nth-child(3)', // Highlight the feature importance section
  },
  {
    title: "Step 11: Machine learning",
    content: "These show dataset information.",
    selector: '.machine-learning-container', // Highlight the feature importance section
  },

  {
    title: "Step 12: Info icons",
    content: "These show dataset information.",
    selector: '.icon', // Highlight the feature importance section
  },
  {
    title: "Step 13: Finished",
    content: "That's it! You're ready to use the app.",
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
  
      if (currentStep === 10 || currentStep === 8 || currentStep===1) { // Step 11 is index 10 (zero-indexed)
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
    if (currentStep === 3) {
      top = '40%';   // Move the modal a bit higher
      left = '800px';  // Move the modal more to the right
    } else if (currentStep === 5) {
      top = '40%';   // Move the modal lower
      left = '40%';  // Move the modal more to the left
    }
    else if(currentStep===2){
        top = '40%';   // Move the modal lower
        left = '30%'; 
    }
    // Add any custom positions you want for other steps here

    return { top, left };
  };


  
  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
    if (currentStep === 6) {  // Step 7 is index 6 (zero-indexed)
      navigate('/digital-biomarkers', { state: { tutorialStep: 7 } });
    }
    if (currentStep === 9) {  // Step 7 is index 6 (zero-indexed)
        navigate('/machine-learning', { state: { tutorialStep: 10 } });
      }

      if (currentStep === 10) {  // Step 7 is index 6 (zero-indexed)
        navigate('/overview', { state: { tutorialStep: 11 } });
      }
    
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
    if(currentStep === 7)
    {
        navigate('/overview', { state: { tutorialStep: 6 } });
    }
    if (currentStep === 10) {  // Step 7 is index 6 (zero-indexed)
        navigate('/digital-biomarkers', { state: { tutorialStep: 9 } });
      }
    if (currentStep === 11) {  // Step 7 is index 6 (zero-indexed)
        navigate('/machine-learning', { state: { tutorialStep: 10 } });
    }
    
  };

  return (
    <div>
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
      />
      {/* Overlay for the mask */}
      <>
        
        <div className="tutorial-overlay" style={{ ...maskStyles.topMask}}/>
        {step.selector && (
          <>
            <div className="tutorial-overlay" style={{ ...maskStyles.leftMask }} />
            <div className="tutorial-overlay" style={{ ...maskStyles.rightMask }} />
            <div className="tutorial-overlay" style={{ ...maskStyles.bottomMask }} />
          </>
        )}
      </>

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
