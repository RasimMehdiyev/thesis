import React, { useState, useEffect, useRef } from 'react';

const Questionnaire = ({ onClose }) => {
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]); 
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const chatBodyRef = useRef(null);

  
  const questionMap = [
    { question: "What is your Prolific ID?", answers: [], charLimit: 24, noSpecialChars: true },  // Limited to 24 characters, no special characters
    { question: "How old are you?", answers: ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"], charLimit: null, noSpecialChars: false },  // Multiple-choice question
    { question: "What is your highest level of education?", answers: ["Highschool diploma", "Bachelor’s degree", "Master’s degree", "Doctoral Degree (PhD)", "Medical degree (e.g., MD, DO)", "Other (please specify)"], charLimit: null, noSpecialChars: false },  // Multiple-choice question
    { question: "Describe your job in the medical field in your own terms.", answers: [], charLimit: 100, noSpecialChars: false },  // Open-ended question with a 100-character limit
    { question: "How many years of professional experience do you have in the medical field?", answers: [], charLimit: 50, noSpecialChars: false }  // Open-ended question with a limit
  ];

  const isValidProlificID = (input) => /^[a-zA-Z0-9]{24}$/.test(input);

  useEffect(() => {
    sendSystemMessage(questionMap[0].question);  
  }, []);


  const handleInputChange = (e) => {
    let value = e.target.value;


    if (questionMap[currentQuestionIndex].noSpecialChars) {
      value = value.replace(/[^a-zA-Z0-9]/g, '');  
    }

    setMessage(value);
  };


  const handleSendMessage = (answer = message) => {
    if (answer.trim()) {
      const currentQuestion = questionMap[currentQuestionIndex];

      if (currentQuestionIndex === 0 && !isValidProlificID(answer)) {
        setErrorMessage("Prolific ID must be exactly 24 alphanumeric characters.");
        return;
      }


      setErrorMessage('');

      const newChatLog = [...chatLog, { sender: 'You', message: answer }];
      setChatLog(newChatLog);
      setMessage('');

    
      setTimeout(() => {
        if (currentQuestionIndex < questionMap.length - 1) {
          const nextIndex = currentQuestionIndex + 1;
          sendSystemMessage(questionMap[nextIndex].question);
          setCurrentQuestionIndex(nextIndex); 
        } else {
          sendSystemMessage("Thank you for completing the questionnaire!");
        }
      }, 1000);
    }
  };

  const sendSystemMessage = (systemMessage) => {
    setChatLog((prevChatLog) => [...prevChatLog, { sender: 'Researchers', message: systemMessage }]);
  };

  
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatLog]);


  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();  
      handleSendMessage();
    }
  };


  const handleOptionClick = (selectedOption) => {
    handleSendMessage(selectedOption); 
  };

  return (
    <div className="chatbox">
      <div className="chatbox-header">
        <h3>Questionnaire {currentQuestionIndex + 1}/{questionMap.length}</h3>
      </div>
      <div className="chatbox-body" ref={chatBodyRef}>
        {chatLog.map((chat, index) => (
          <div key={index} className={`chat-message ${chat.sender === 'You' ? 'user-message' : 'system-message'}`}>
            <strong>{chat.sender}:</strong> {chat.message}
          </div>
        ))}
      </div>
      <div className="chatbox-footer">

        {questionMap[currentQuestionIndex].answers.length > 0 ? (
          <div className="options">
            <p>Please select an option:</p>
            {questionMap[currentQuestionIndex].answers.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(option)}  
                className="option-button"
                style={{width: 'auto', height: 'auto', borderRadius:10, marginBottom: 10}}
              >
                {option}
              </button>
            ))}
          </div>
        ) : (
          <>

            <textarea
              maxLength={questionMap[currentQuestionIndex].charLimit || 100}  
              value={message}
              onChange={handleInputChange} 
              onKeyDown={handleKeyDown}
              placeholder="Type your answer..."
              rows={message.length > 50 ? 5 : 2} 
              style={{ resize: 'none', width: '100%', padding: '10px', fontSize: '16px', borderRadius: 10, fontFamily:'Poppins' }}  // No resize handle
            />
            <button onClick={() => handleSendMessage()}>
              <img
                src='/assets/send_arrow.svg'
                alt='Send'
                className='send-icon'
                style={{ cursor: 'pointer' }}
              />
            </button>
          </>
        )}
      </div>

      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};

export default Questionnaire;
