import React from 'react';

const TutorialModal = ({
  stepTitle,
  content,
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onSkip,
  top,  // Now accepting top position
  left, // Now accepting left position
}) => {
  return (
    <div className="tutorial-modal"
      style={{
        top: top,   // Use the top prop
        left: left, // Use the left prop
      }}>
    
      <div className="tutorial-modal-h">
        {/* Step title */}
        <h2 style={{ marginLeft: 0, fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase' }}>STEP {currentStep+1}/13</h2>
        <div >
            <p
            onClick={onSkip}
            style={{
                color: '#fff',
                fontSize: '11px',
                cursor: 'pointer',
                textDecoration: 'underline',
            }}
            >
            skip tutorial
            </p>
        </div>
      </div>

      

      {/* Content */}
      <p
        style={{ fontSize: '14px', marginTop: '10px' }}
        dangerouslySetInnerHTML={{ __html: content }}
      ></p>

      {/* Buttons */}
      <div className= "modal-buttons">
        {currentStep > 0 && (
          <button
            onClick={onPrev}
            style={{
                justifyContent:"flex-start",
              backgroundColor: '#fff',
              color: '#4A00E0',
              padding: '8px 20px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Back
          </button>
        )}
        <button onClick={onNext} style={{ marginLeft:'auto'}}>
          {currentStep === totalSteps - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default TutorialModal;
