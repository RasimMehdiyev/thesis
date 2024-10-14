import React, { useState, useEffect, useRef } from 'react';

const Questionnaire = ({ onClose }) => {
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]); 
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);  
  const [errorMessage, setErrorMessage] = useState('');
  const [backButtonDisabled, setBackButtonDisabled] = useState(false);
  const chatBodyRef = useRef(null);


  const questionMap = [
    { question: "What is your Prolific ID?", answers: [], charLimit: 24, noSpecialChars: true },
    { question: "How old are you?", answers: ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"], charLimit: null, noSpecialChars: false },
    { question: "What is your highest level of education?", answers: ["Highschool diploma", "Bachelor’s degree", "Master’s degree", "Doctoral Degree (PhD)", "Medical degree (e.g., MD, DO)", "Other (please specify)"], charLimit: null, noSpecialChars: false },
    { question: "Describe your job in the medical field in your own terms.", answers: [], charLimit: 100, noSpecialChars: false },
    { question: "How many years of professional experience do you have in the medical field?", answers: ["None", "1-4 years", "5-14 years", "15+ years"], charLimit: 50, noSpecialChars: false }
  ];

  const isValidProlificID = (input) => /^[a-zA-Z0-9]{24}$/.test(input);

  // Display the first question when the component loads
  useEffect(() => {
    sendSystemMessage(questionMap[0].question);
  }, []);


  const handleInputChange = (e) => {
    let value = e.target.value;

    // Remove special characters if specified
    if (questionMap[currentQuestionIndex].noSpecialChars) {
      value = value.replace(/[^a-zA-Z0-9]/g, '');
    }

    setMessage(value);
  };


  const handleSendMessage = (answer = message) => {
    if (answer.trim()) {
      const currentQuestion = questionMap[currentQuestionIndex];

      // Prolific ID validation for the first question
      if (currentQuestionIndex === 0 && !isValidProlificID(answer)) {
        setErrorMessage("Prolific ID must be exactly 24 alphanumeric characters.");
        return;
      }

      setErrorMessage('');
      setBackButtonDisabled(true); // Disable the back button while processing the transition

      // Add the user's answer to the chat log
      const newChatLog = [...chatLog, { sender: 'You', message: answer }];
      setChatLog(newChatLog); // Append the user's answer
      setMessage(''); // Clear input field

      // Move to the next question unless at the end
      setTimeout(() => {
        if (currentQuestionIndex < questionMap.length - 1) {
          const nextIndex = currentQuestionIndex + 1;
          sendSystemMessage(questionMap[nextIndex].question); // Append next question to chat log
          setCurrentQuestionIndex(nextIndex);
        } else {
          sendSystemMessage("Thank you for completing the questionnaire!");
        }

        // Re-enable back button after the transition to the next question
        setBackButtonDisabled(false);
      }, 1000); // Delay before the next question is shown
    }
  };


  const sendSystemMessage = (systemMessage) => {
    setChatLog((prevChatLog) => [...prevChatLog, { sender: 'Researchers', message: systemMessage }]);
  };

  // Auto-scroll when new messages are added
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatLog]);

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;

      // Remove the last question and answer from the chat log
      const updatedChatLog = [...chatLog];
      
      // Remove the current question and answer 
      updatedChatLog.splice(updatedChatLog.length - 2, 2);
      setChatLog(updatedChatLog);

      const previousAnswer = updatedChatLog[(prevIndex * 2) + 1]?.message || ''; // Access the previous answer (sequentially)

      setMessage(previousAnswer);

      setCurrentQuestionIndex(prevIndex);

      // Update the log to display only the previous question and answer
      setTimeout(() => {
        // Don't append the previous question and answer twice.
        if (updatedChatLog.length === 0 || updatedChatLog[updatedChatLog.length - 1]?.message !== questionMap[prevIndex].question) {
          sendSystemMessage(questionMap[prevIndex].question); // Re-send previous question
          if (previousAnswer) {
            sendUserMessage(previousAnswer); // Re-send previous answer
          }
        }
      }, 500); 
    }
  };


  const sendUserMessage = (message) => {
    setChatLog((prevChatLog) => [...prevChatLog, { sender: 'You', message }]);
  };

  const isSendButtonDisabled = () => {
    const currentQuestion = questionMap[currentQuestionIndex];
    if (currentQuestionIndex === 0) {
      return !isValidProlificID(message);  
    }
    return message.trim() === '';  
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
        <div className="footer-row">
          <button 
            className="back-button" 
            onClick={handleBack} 
            disabled={backButtonDisabled || currentQuestionIndex === 0}  // Disable when processing or on the first question
          >
            ← back to previous question
          </button>
        </div>


        <div className="input-row">
          {questionMap[currentQuestionIndex].answers && questionMap[currentQuestionIndex].answers.length > 0 ? (
            <div className="options">
              <p>Please select an option:</p>
              {questionMap[currentQuestionIndex].answers.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(option)}
                  className="option-button"
                  style={{ width: 'auto', height: 'auto', borderRadius: 10, marginBottom: 10 }}
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
                placeholder="Type your answer..."
                rows={message.length > 50 ? 5 : 1}
                style={{ resize: 'none', width: '100%', fontSize: '16px', borderRadius: 10 }}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isSendButtonDisabled()}
                className="send-button"
              >
                <img
                  src='/assets/send_arrow.svg'
                  alt='Send'
                  className='send-icon'
                />
              </button>
            </>
          )}
        </div>
      </div>


      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};

export default Questionnaire;
