import React, { useState, useEffect, useRef } from 'react';

const Questionnaire = ({ onClose, onQuestionnaireComplete }) => {
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [backButtonDisabled, setBackButtonDisabled] = useState(false);
  const [showOtherTextField, setShowOtherTextField] = useState(false);  // For 'Other' option text input
  const [isCompleted, setIsCompleted] = useState(false);
  const [showAnswerOptions, setShowAnswerOptions] = useState(false);
  const [isQuestionVisible, setIsQuestionVisible] = useState(true); 
  const [fetchedSections, setFetchedSections] = useState([]);
  const chatBodyRef = useRef(null);

// Fetch the questionnaire data with fallback
const fetchSections = async () => {
  let apiUrl = '/dashboard/questionnaire/6/sections/';
  let fallbackUrl = '/questions.json';

  try {
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch from API: ${response.statusText}`);
    }

    const data = await response.json();
    setFetchedSections(data); 
  } catch (error) {
    console.error('Error fetching from API:', error);
    
    try {
      const fallbackResponse = await fetch(fallbackUrl);
      const fallbackData = await fallbackResponse.json();
      setFetchedSections(fallbackData);
    } catch (fallbackError) {
      console.error('Error fetching from fallback JSON:', fallbackError);
    }
  }
};


  useEffect(() => {
    fetchSections(); 
  }, []);

  useEffect(() => {
    console.log('fetchedSections:', fetchedSections);
  }, [fetchedSections]);

  // Get the current section and question
  const currentSection = fetchedSections[currentSectionIndex] || {};
  const questionMap = currentSection?.questions || [];

  // Restore saved state on load
  useEffect(() => {
    const savedChatLog = JSON.parse(localStorage.getItem('chatLog'));
    const savedMessage = localStorage.getItem('message');
    const savedCurrentQuestionIndex = Number(localStorage.getItem('currentQuestionIndex'));
    const savedCurrentSectionIndex = Number(localStorage.getItem('currentSectionIndex'));
    const savedIsCompleted = JSON.parse(localStorage.getItem('isCompleted'));
    const savedShowAnswerOptions = JSON.parse(localStorage.getItem('showAnswerOptions'));
    const savedIsQuestionVisible = JSON.parse(localStorage.getItem('isQuestionVisible'));

    // If saved chat log exists, restore the state
    if (savedChatLog && savedChatLog.length > 0) {
      setChatLog(savedChatLog);
      setMessage(savedMessage || '');
      setIsCompleted(savedIsCompleted || false);
      setShowAnswerOptions(savedShowAnswerOptions || false);
      setIsQuestionVisible(savedIsQuestionVisible || false);

      // Restore section and question index
      const validSectionIndex = !isNaN(savedCurrentSectionIndex) ? savedCurrentSectionIndex : 0;
      const validQuestionIndex = !isNaN(savedCurrentQuestionIndex) ? savedCurrentQuestionIndex : 0;

      setCurrentSectionIndex(validSectionIndex);
      setCurrentQuestionIndex(validQuestionIndex);

      // Check if section title and question are already in the log
      const sectionTitleInLog = savedChatLog.some(entry => entry.message === currentSection.title_desc);
      const questionInLog = savedChatLog.some(entry => entry.message === questionMap[validQuestionIndex]?.question);

      // Send section title and question if missing in the log
      if (!sectionTitleInLog && currentSection.title_desc) {
        sendSystemMessage(currentSection.title_desc);
      }

      if (!questionInLog && questionMap[validQuestionIndex]?.question) {
        sendSystemMessage(questionMap[validQuestionIndex].question);
      }
    } else if (questionMap.length > 0 && currentSection.title_desc) {
      // If no saved state, show the first section title and question
      sendSystemMessage(currentSection.title_desc);
      sendSystemMessage(questionMap[0].question);
    }
  }, [fetchedSections]);

  // Save chat state to localStorage whenever it updates
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

  // Handle input changes and apply validation
  const handleInputChange = (e) => {
    let value = e.target.value;
    const currentQuestion = questionMap[currentQuestionIndex];

    // Clear previous errors
    setErrorMessage('');

    // Apply the noSpecialChars rule
    if (currentQuestion?.noSpecialChars) {
      const containsSpecialChars = /[^a-zA-Z0-9]/g.test(value);
      if (containsSpecialChars) {
        setErrorMessage('Special characters are not allowed.');
        value = value.replace(/[^a-zA-Z0-9]/g, ''); // Remove special characters
      }
    }

    // Apply charLimit if it exists
    if (currentQuestion?.charLimit && value.length > currentQuestion.charLimit) {
      setErrorMessage(`Character limit exceeded. Max ${currentQuestion.charLimit} characters allowed.`);
      value = value.substring(0, currentQuestion.charLimit); // Truncate the value to the charLimit
    }

    setMessage(value); // Update the message with the valid value
  };

  const handleSendMessage = (answer = message, skip = false) => {
    const currentQuestion = questionMap[currentQuestionIndex];

    if (skip && !currentQuestion?.required) {
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
      sendSystemMessage(questionMap[nextIndex]?.question);
      setCurrentQuestionIndex(nextIndex);
      setShowAnswerOptions(true);
      setIsQuestionVisible(true);
    } else if (currentSectionIndex < fetchedSections.length - 1) {
      const nextSectionIndex = currentSectionIndex + 1;
      setCurrentSectionIndex(nextSectionIndex);
      setCurrentQuestionIndex(0);
      sendSystemMessage(fetchedSections[nextSectionIndex]?.title_desc);
      sendSystemMessage(fetchedSections[nextSectionIndex]?.questions[0]?.question);
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
        const previousQuestion = questionMap[prevIndex]?.question;

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

    if (currentQuestion?.question.includes("percentage")) {
      const percentage = parseInt(message, 10);
      return isNaN(percentage) || percentage < 0 || percentage > 100;
    }

    return message.trim() === '';
  };

  const handleOptionClick = (option) => {
    if (option === "Other" || option === "Other (please specify)") {
      setShowOtherTextField(true);
      setMessage(""); // Clear any previous message for a fresh custom input
    } else {
      setShowOtherTextField(false); // Hide the text area if another option is selected
      handleSendMessage(option); // Send the selected option as the answer
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
                  ) : showOtherTextField ? (
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
                        placeholder="Please specify..."
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
              {/* Show error messages */}
              {errorMessage && <div style={{marginTop: '3px'}} className="error-message">{errorMessage}</div>}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
