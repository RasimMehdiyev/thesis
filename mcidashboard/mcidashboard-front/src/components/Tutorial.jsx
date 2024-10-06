import React, { useState, useRef, useEffect } from 'react';


const tutorialSteps = [
  {
    title: "Step 1: Welcome",
    content: "Welcome to the <strong>Solitaire Decision Support System!</strong><br>Click 'Next' to start the tutorial.",
    selector: null, // No highlight for the first step
  },
  {
    title: "Step 2: Personal Information",
    content: "Here you can view your personal information.",
    selector: '#pers-card', // Highlight this element
  },
  {
    title: "Step 3: Digital Biomarkers",
    content: "These are the digital biomarkers that power our app's features.",
    selector: '#dig-card', 
  },
  {
    title: "Step 4: Finished",
    content: "That's it! You're ready to use the app.",
    selector: null, 
  },
];

const Tutorial = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const step = tutorialSteps[currentStep];


  const highlightRef = useRef(null);

  const getMaskStyles = (selector) => {
    if (!selector) return {};
    const element = document.querySelector(selector);
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

  const [maskStyles, setMaskStyles] = useState({});

  // Recalculate mask styles on window resize and step change
  useEffect(() => {
    const updateMaskStyles = () => {
      if (step.selector) {
        setMaskStyles(getMaskStyles(step.selector));
      }
    };

    // Initial calculation
    updateMaskStyles();

    // Listen for window resize
    window.addEventListener('resize', updateMaskStyles);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', updateMaskStyles);
    };
  }, [step.selector]);

  // Calculate the tooltip position whenever the step changes
  useEffect(() => {
    if (step.selector) {
      const element = document.querySelector(step.selector);
      if (element) {
        const rect = element.getBoundingClientRect();
        setTooltipPosition({
          top: rect.top + window.scrollY + rect.height / 2, 
          left: rect.right + 10, 
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
  };


  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div>
      {/* Overlay for the mask - Step 2 */}
      {step.selector && (
        <>
          <div className="tutorial-overlay" style={{ ...maskStyles.topMask }} />
          <div className="tutorial-overlay" style={{ ...maskStyles.leftMask }} />
          <div className="tutorial-overlay" style={{ ...maskStyles.rightMask }} />
          <div className="tutorial-overlay" style={{ ...maskStyles.bottomMask }} />
        </>
      )}

      {/* Conditionally adjust the modal position based on the current step */}
      <div
        className="tutorial-modal"
        style={{
          position: 'fixed',
          top: '50%',
          left: currentStep === 1 ? '40%' : '30%', // Move the modal to the right during Step 2
          transform: currentStep === 1 ? 'translate(50%, -50%)' : 'translate(-50%, -50%)',
          zIndex: 1001,
        }}
      >
        <h2>{step.title}</h2>
        {/* Render HTML content using dangerouslySetInnerHTML */}
        <p dangerouslySetInnerHTML={{ __html: step.content }}></p>
        <div>
          {currentStep > 0 && <button onClick={handlePrev}>Previous</button>}
          {currentStep < tutorialSteps.length - 1 && <button onClick={handleNext}>Next</button>}
          {currentStep === tutorialSteps.length - 1 && <button onClick={() => alert('Tutorial Finished!')}>Finish</button>}
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
