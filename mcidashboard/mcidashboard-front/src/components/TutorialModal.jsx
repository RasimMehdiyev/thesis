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
    <div
      style={{
        position: 'fixed',
        fontStyle: 'Poppins',
        top: top,   // Use the top prop
        left: left, // Use the left prop
        backgroundColor: '#4A00E0', // Vibrant blue-purple background
        borderRadius: '20px',
        padding: '20px',
        width: '300px',
        transform:  'translate(-50%, -50%)',
        zIndex: 1001,
        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
        color: '#fff', // White text
        textAlign: 'center',
        fontFamily: "'Arial', sans-serif",
      }}
    >
      {/* Skip link */}
      <div style={{ position: 'absolute', top: '10px', right: '15px' }}>
        <p
          onClick={onSkip}
          style={{
            color: '#fff',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          skip tutorial
        </p>
      </div>

      {/* Step title */}
      <h2 style={{ margin: 10, fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase' }}>
        STEP {currentStep+1}/13
      </h2>

      {/* Content */}
      <p
        style={{ fontSize: '14px', marginTop: '10px', fontWeight: 500 }}
        dangerouslySetInnerHTML={{ __html: content }}
      ></p>

      {/* Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        {currentStep > 0 && (
          <button
            onClick={onPrev}
            style={{
              backgroundColor: '#fff',
              color: '#4A00E0',
              padding: '8px 20px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Back
          </button>
        )}
        <button
          onClick={onNext}
          style={{
            backgroundColor: '#fff',
            color: '#4A00E0',
            padding: '8px 20px',
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          {currentStep === totalSteps - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default TutorialModal;
