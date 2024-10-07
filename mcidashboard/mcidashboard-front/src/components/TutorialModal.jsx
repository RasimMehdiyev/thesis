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
        position: 'fixed'
      }}>
    
      <div className="tutorial-modal-h">
        <h2 style={{ marginLeft: 0, marginTop: 0, fontSize: '16px', fontWeight: 'bold', color: '#DAD3FF', fontStyle: 'italic'}}>STEP <span style={{fontSize: 24, fontStyle: 'normal', color: 'white'}}>{currentStep+1}</span>/17</h2>
        <div >
            <p className='skip'onClick={onSkip}> skip tutorial</p>
        </div>
      </div>

      <p style={{ fontSize: '18px', marginTop: '12px', fontWeight:'bold'}} dangerouslySetInnerHTML={{ __html: stepTitle }}></p>

      <p style={{ fontSize: '14px', marginTop: '10px', marginBottom: '20px' }} dangerouslySetInnerHTML={{ __html: content }}></p>


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
