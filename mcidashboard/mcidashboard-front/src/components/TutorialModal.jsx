import React from 'react';

const TutorialModal = ({
  stepTitle,
  content,
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onSkip,
  top,  
  left, 
}) => {
  return (
    <div className="tutorial-modal"
      style={{
        top: top,   
        left: left,
      }}>
    
      <div className="tutorial-modal-h">
        <h2 style={{ marginLeft: 0, fontSize: '16px', fontWeight: 'bold'}}>STEP {currentStep+1}/13</h2>
        <div >
            <p className='skip'onClick={onSkip}> skip tutorial</p>
        </div>
      </div>

      <p style={{ fontSize: '14px', marginTop: '10px' }} dangerouslySetInnerHTML={{ __html: content }}></p>


      <div className= "modal-buttons">
        {currentStep > 0 && (
          <button onClick={onPrev}>Back</button>
        )}
        <button onClick={onNext} style={{ marginLeft:'auto'}}>
          {currentStep === totalSteps - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default TutorialModal;
