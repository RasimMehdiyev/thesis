import React, { useState, useEffect, useRef } from 'react';

const Questionnaire = ({ onClose, onQuestionnaireComplete }) => {
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);  
  const [errorMessage, setErrorMessage] = useState('');
  const [backButtonDisabled, setBackButtonDisabled] = useState(false);
  const [showOtherTextField, setShowOtherTextField] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showAnswerOptions, setShowAnswerOptions] = useState(false);
  const [isQuestionVisible, setIsQuestionVisible] = useState(true); 
  const [fetchedSections, setFetchedSections] = useState([]);
  const chatBodyRef = useRef(null);

  // Fetch the questionnaire data
  const fetchSections = async () => {
    let url  = '/questions.json';
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      setFetchedSections(data); // Store the full fetched data structure
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  useEffect(() => {
    fetchSections(); // Fetch sections when the component mounts
  }, []);

  // Get the current section and question
  const currentSection = fetchedSections[currentSectionIndex] || {};
  const questionMap = currentSection?.questions || [];

  useEffect(() => {
    if (questionMap.length > 0) {
      // Check if the current section title is already in the chatLog
      const sectionTitleInLog = chatLog.some(
        (entry) => entry.sender === 'Researchers' && entry.message === currentSection.title
      );
      
      // Only send the section title if it hasn't already been sent
      if (!sectionTitleInLog) {
        sendSystemMessage(currentSection.title);
      }
  
      // Check if the current question is already in the chatLog
      const questionInLog = chatLog.some(
        (entry) => entry.sender === 'Researchers' && entry.message === questionMap[currentQuestionIndex].question
      );
  
      // Only send the question if it hasn't already been sent
      if (!questionInLog) {
        sendSystemMessage(questionMap[currentQuestionIndex].question);
      }
    }
  }, [currentSectionIndex, currentQuestionIndex, fetchedSections]);
  

  // Detect page reload and clear localStorage
  useEffect(() => {
    window.onbeforeunload = () => {
      localStorage.clear();
    };
  }, []);

  // Save chat state to localStorage
  useEffect(() => {
    localStorage.setItem('chatLog', JSON.stringify(chatLog));
  }, [chatLog]);

  useEffect(() => {
    localStorage.setItem('message', message);
  }, [message]);

  useEffect(() => {
    localStorage.setItem('currentQuestionIndex', currentQuestionIndex);
  }, [currentQuestionIndex]);

  useEffect(() => {
    localStorage.setItem('currentSectionIndex', currentSectionIndex);
  }, [currentSectionIndex]);

  useEffect(() => {
    localStorage.setItem('isCompleted', JSON.stringify(isCompleted));
  }, [isCompleted]);

  useEffect(() => {
    localStorage.setItem('showAnswerOptions', JSON.stringify(showAnswerOptions));
  }, [showAnswerOptions]);

  useEffect(() => {
    localStorage.setItem('isQuestionVisible', JSON.stringify(isQuestionVisible));
  }, [isQuestionVisible]);

  // Scroll chat window to the bottom whenever the chat log updates
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatLog]);

  const handleInputChange = (e) => {
    let value = e.target.value;

    if (questionMap[currentQuestionIndex].question.includes("percentage")) {
      if (/^\d{0,3}$/.test(value) && value >= 0 && value <= 100) {
        setMessage(value);
        setErrorMessage('');
      } else {
        setErrorMessage('Please enter a valid percentage between 0 and 100.');
      }
    } else if (questionMap[currentQuestionIndex].noSpecialChars) {
      if (/[^a-zA-Z0-9]/g.test(value)) {
        setErrorMessage('Please enter a valid Prolific ID.');
      } else {
        setErrorMessage('');
      }
      value = value.replace(/[^a-zA-Z0-9]/g, '');
      setMessage(value);
    } else {
      setMessage(value);
    }
  };

  const handleSendMessage = (answer = message, skip = false) => {
    const currentQuestion = questionMap[currentQuestionIndex];

    if (skip && !currentQuestion.required) {
      moveToNextQuestion();
      return;
    }

    if (answer.trim()) {
      setErrorMessage('');
      setBackButtonDisabled(true);
      setShowOtherTextField(false);
      setShowAnswerOptions(false);
      setIsQuestionVisible(false);

      const newChatLog = [...chatLog, { sender: 'You', message: answer, questionIndex: currentQuestionIndex }];
      setChatLog(newChatLog);
      setMessage('');

      setTimeout(() => {
        moveToNextQuestion();
        setBackButtonDisabled(false);
      }, 300);
    }
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < questionMap.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      sendSystemMessage(questionMap[nextIndex].question);
      setCurrentQuestionIndex(nextIndex);
      setShowAnswerOptions(true);
      setIsQuestionVisible(true);
    } else if (currentSectionIndex < fetchedSections.length - 1) {
      const nextSectionIndex = currentSectionIndex + 1;
      setCurrentSectionIndex(nextSectionIndex);
      setCurrentQuestionIndex(0);
      sendSystemMessage(fetchedSections[nextSectionIndex].title);
      sendSystemMessage(fetchedSections[nextSectionIndex].questions[0].question);
      setShowAnswerOptions(true);
      setIsQuestionVisible(true);
    } else {
      if (!isCompleted) {
        setIsCompleted(true);
        sendSystemMessage("Thank you for your participation!");
      }
    }
  };

  const sendSystemMessage = (systemMessage) => {
    setChatLog((prevChatLog) => [...prevChatLog, { sender: 'Researchers', message: systemMessage }]);
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      const updatedChatLog = [...chatLog];

      if (isCompleted) {
        updatedChatLog.splice(updatedChatLog.length - 2, 2);
        setIsCompleted(false);
      } else {
        updatedChatLog.splice(updatedChatLog.length - 2, 2);
      }

      setChatLog(updatedChatLog);
      setMessage('');
      setCurrentQuestionIndex(prevIndex);
      setShowOtherTextField(false);

      setTimeout(() => {
        const previousQuestion = questionMap[prevIndex].question;

        const previousAnswer = updatedChatLog.find(
          (entry) => entry.sender === 'You' && entry.questionIndex === prevIndex
        )?.message || '';

        if (!updatedChatLog.some((entry) => entry.message === previousQuestion)) {
          sendSystemMessage(previousQuestion);
        }
      }, 300);
    }
  };

  const isSendButtonDisabled = () => {
    const currentQuestion = questionMap[currentQuestionIndex];

    if (currentSectionIndex === 0 && currentQuestionIndex === 0) {
      return !/^[a-zA-Z0-9]{24}$/.test(message); // Prolific ID validation
    }

    if (currentQuestion.question.includes("percentage")) {
      const percentage = parseInt(message, 10);
      return isNaN(percentage) || percentage < 0 || percentage > 100;
    }

    return message.trim() === '';
  };

  const handleOptionClick = (option) => {
    if (option === "Other") {
      setShowOtherTextField(true);
      setMessage("");
    } else {
      handleSendMessage(option);
    }
  };

  return (
    <div>
      <div className="chatbox">
        <div className="chatbox-header">
          <p style={{ marginTop: 0 }}>
            <span style={{ fontSize: 14 }}>
              <strong style={{ fontSize: 18 }}>TESTING QUESTIONNAIRE</strong> <br />
              PART <span style={{ fontSize: 24 }}>{currentSectionIndex + 1}</span>/{fetchedSections.length} - QUESTION{' '}
              <span style={{ fontSize: 24 }}>{currentQuestionIndex + 1}</span>/{questionMap.length}
            </span>
          </p>
        </div>
        <div className="chatbox-body" ref={chatBodyRef}>
          {chatLog.map((chat, index) => (
            <div key={index} className={`chat-message ${chat.sender === 'You' ? 'user-message' : 'system-message'}`}>
              <strong>{chat.sender}:</strong> {chat.message}
            </div>
          ))}
        </div>

        <div className="chatbox-footer">
          {!isCompleted && (
            <>
              <div className="footer-row">
                <button
                  className="back-button"
                  onClick={handleBack}
                  disabled={backButtonDisabled}
                  style={{ 
                    display: currentQuestionIndex === 0 || 
                    (currentSectionIndex === 0 && currentQuestionIndex === questionMap.length - 1) ? 'none' : 'block' 
                  }}
                >
                  ← back to previous question
                </button>
                {!questionMap[currentQuestionIndex]?.required && isQuestionVisible && (
                  <button
                    onClick={() => handleSendMessage('', true)}
                    className="skip-button"
                  >
                    skip →
                  </button>
                )}
              </div>

              {isQuestionVisible && (
                <div className="input-row">
                  {questionMap[currentQuestionIndex]?.answers?.length > 0 && !showOtherTextField && showAnswerOptions ? (
                    <div>
                      <p style={{ textAlign: 'right' }}>Please select an option:</p>
                      <div className="options">
                        {questionMap[currentQuestionIndex].answers.map((option, index) => (
                          <button key={index} onClick={() => handleOptionClick(option)} className="option-button">
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      <textarea
                        maxLength={questionMap[currentQuestionIndex]?.charLimit || undefined}
                        value={message}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !isSendButtonDisabled()) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder={showOtherTextField ? 'Please specify...' : 'Type your answer...'}
                        rows={message.length > 50 ? 5 : 1}
                        style={{ resize: 'none', width: '100%', fontSize: '16px' }}
                      />
                      <button
                        onClick={() => handleSendMessage()}
                        disabled={isSendButtonDisabled()}
                        className="send-button"
                      >
                        <img src="/assets/send_arrow.svg" alt="Send" className="send-icon" />
                      </button>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default Questionnaire;
