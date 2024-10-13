import React, { useState, useEffect, useRef } from 'react';

const Questionnaire = ({ onClose }) => {
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]); 
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const chatBodyRef = useRef(null);


  const questions = [
    { text: "What is your Prolific ID?", type: 'prolificId' },
    { text: "How old are you?", type: 'age' },
    { text: "What is your highest level of education?", type: 'text' },
    { text: "Describe your job in the medical field in your own terms.", type: 'text' },
    { text: "How many years of professional experience do you have in the medical field?", type: 'number' }
  ];

  const ageOptions = [
    "18-24",
    "25-34",
    "35-44",
    "45-54",
    "55-64",
    "65+"
  ];

  const isValidProlificID = (input) => /^[a-zA-Z0-9]{24}$/.test(input);


  useEffect(() => {
    sendSystemMessage(questions[0].text); 
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, ''); // Remove special characters
    setMessage(value);
  };


  const handleSendMessage = (answer = message) => {
    if (answer.trim()) {

      const currentQuestion = questions[currentQuestionIndex];

      if (currentQuestion.type === 'prolificId' && !isValidProlificID(answer)) {
        setErrorMessage("Prolific ID must be exactly 24 alphanumeric characters.");
        return;
      }

 
      setErrorMessage('');


      const newChatLog = [...chatLog, { sender: 'You', message: answer }];
      setChatLog(newChatLog);
      setMessage('');


      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          const nextIndex = currentQuestionIndex + 1;
          sendSystemMessage(questions[nextIndex].text);
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


  const handleAgeOptionClick = (ageRange) => {
    handleSendMessage(ageRange); 
  };

  return (
    <div className="chatbox">
      <div className="chatbox-header">
        <h3>Questionnaire {currentQuestionIndex + 1}/{questions.length}</h3>
      </div>
      <div className="chatbox-body" ref={chatBodyRef}>
        {chatLog.map((chat, index) => (
          <div key={index} className={`chat-message ${chat.sender === 'You' ? 'user-message' : 'system-message'}`}>
            <strong>{chat.sender}:</strong> {chat.message}
          </div>
        ))}
      </div>
      <div className="chatbox-footer">

        {currentQuestionIndex === 1 && (  
          <div className="age-options">
            <p>Please select your age range:</p>
            {ageOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAgeOptionClick(option)}  
                className="age-option-button"
                style={{width: 70, height: 40, borderRadius:0, marginBottom: 10}}
              >
                {option}
              </button>
            ))}
          </div>
        )}
        

        {currentQuestionIndex !== 1 && (
          <>
            <input
              maxLength={24} 
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={'Type your answer...'}
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
