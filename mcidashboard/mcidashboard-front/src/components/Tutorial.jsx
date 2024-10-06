import React, { useState, useEffect, useRef } from 'react';   
import { useNavigate, useLocation } from 'react-router-dom';
import Tooltip from './Tooltip'; // Adjust the path accordingly


const tutorialSteps = [
  {
    title: "Step 1: Welcome",
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
    title: "Step 8: Finished",
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
  const getMaskStyles = (selector) => {
    if (!selector) {
      // Full-page overlay for Step 1 (or any step without a selector)
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

    // Calculate positions of the 4 mask elements
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
        top: `${rect.top}px`,
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
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Recalculate mask styles after scrolling
  const updateMaskAfterScroll = (selector) => {
    setTimeout(() => {
      setMaskStyles(getMaskStyles(selector));
      setTimeout(() => setIsModalVisible(true), 460); // Show modal with 500ms delay
    }, 400); // Adding a small delay to wait for the scroll animation to complete
  };

  // Recalculate mask styles on window resize and step change
  useEffect(() => {
    const updateMaskStyles = () => {
      setIsModalVisible(false); // Hide the modal before recalculating mask

      if (step.selector) {
        scrollToElement(step.selector); // Scroll to the element
        updateMaskAfterScroll(step.selector); // Update the mask after scrolling
      } else {
        setMaskStyles(getMaskStyles(step.selector)); // Full overlay for step 1
        setTimeout(() => setIsModalVisible(true), 500); // Show modal after delay
      }

      disableScroll(); // Disable scrolling for all steps
    };

    // Initial calculation
    window.scrollTo(0, 0);
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

  
  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
    if (currentStep === 6) {  // Step 7 is index 6 (zero-indexed)
      navigate('/digital-biomarkers', { state: { tutorialStep: 7 } });
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
        {currentStep!==1 && (
        <div className="tutorial-overlay" style={{ ...maskStyles.topMask}}/>)}
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
        <div
          className="tutorial-modal"
          style={{
            position: 'fixed',
            top: '50%',
            left: (currentStep === 3 || currentStep === 5) ? '40%' : '30%', // Move the modal to the right during specific steps
            transform: (currentStep === 3|| currentStep === 5) ? 'translate(50%, -50%)' : 'translate(-50%, -50%)',
            zIndex: 1001,
          }}
        >
          <h2>{step.title}</h2>
          {/* Render HTML content using dangerouslySetInnerHTML */}
          <p dangerouslySetInnerHTML={{ __html: step.content }}></p>
          <div>
            {currentStep > 0 && <button onClick={handlePrev}>Previous</button>}
            {currentStep < tutorialSteps.length - 1 && <button onClick={handleNext}>Next</button>}
            {currentStep === tutorialSteps.length - 1 && (
              <button
                onClick={() => {
                  alert('Tutorial Finished!');
                  enableScroll(); // Re-enable scroll after tutorial finishes
                }}
              >
                Finish
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tutorial;
