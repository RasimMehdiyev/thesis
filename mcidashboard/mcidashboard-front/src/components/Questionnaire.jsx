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
  const [logicalSkip, setLogicalSkip] = useState(false);
  const chatBodyRef = useRef(null);
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


  function getCookie(name){
    let cookieValue = null;
    if (document.cookie && document.cookie !== ''){
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++){
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')){
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  const csrftoken = getCookie('csrftoken');

  const submitSection = async (id) => {
    const targetQuestionIds = [15, 29, 65, 73];
    console.log("Submitting section with question ID:", id);
    const questionnaire_id = 6;
    let prolific_id = '';
    let response_id = null;
    let sectionsToSubmit = [];
  
    const responses = JSON.parse(localStorage.getItem('chatLog')) || [];
  
    responses.forEach(r => {
      if (r.sender === 'You' && r.question_id === 0) {
        prolific_id = r.message;
      }
    });
  
    let responseBody = {
      prolific_id: prolific_id,
      questionnaire: questionnaire_id,
    };
  
    try {
      const response = await fetch('/dashboard/response/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify(responseBody),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to submit response: ${response.statusText}`);
      }
  
      const responseData = await response.json();
      console.log("Response created successfully with response_id:", responseData.response_id);
      response_id = responseData.response_id;
    } catch (error) {
      console.error('Error creating response:', error);
      return; // Stop execution if response creation fails
    }
  
    // Step 2: Populate sectionsToSubmit with each question answer, now that we have response_id
    responses.forEach(r => {
      if (r.sender === 'You' && r.question_id !== 0) {
        sectionsToSubmit.push({ response: response_id, question: r.question_id, answer: r.message });
      }
    });
  
    console.log("Sections to submit:", sectionsToSubmit);
  
    // Step 3: Check if the current question ID matches the target IDs
    if (targetQuestionIds.includes(id)) {
      const apiUrl = `/dashboard/response/${response_id}/answer/add/`;
  
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,  // Include CSRF token
          },
          body: JSON.stringify({ sectionsToSubmit }),
          credentials: 'include'  // Ensure cookies are included with the request
        });
  
        if (!response.ok) {
          throw new Error(`Failed to submit section: ${response.statusText}`);
        }
  
        console.log("Section submitted successfully.");
      } catch (error) {
        console.error('Error submitting section:', error);
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

  const [isInputValid, setIsInputValid] = useState(false);

  const handleInputChange = (e) => {
    let value = e.target.value;
    const currentQuestion = questionMap[currentQuestionIndex];

    // Clear previous errors
    setErrorMessage('');
    let isValid = true;

    if (value === '') {
      setErrorMessage('');
      isValid = false;
    }


    if (e.key === 'Backspace' && value === '') {
      setErrorMessage('Please provide an answer.');
      isValid = false;
    }

    let words = currentQuestion.question.split(' ').filter((word) => word.trim() !== '');


    if (currentQuestion?.order === 0){
      if (value.length !== 24){
        setErrorMessage(`Prolific ID should be 24 characters long.`);
        isValid = false;
      }
    }
    
    //if section 1 or section 2, and question is required, min char 

    // Apply charLimit if it exists
    if (currentQuestion?.charLimit && value.length > currentQuestion.charLimit) {
        setErrorMessage(`Character limit exceeded. Max ${currentQuestion.charLimit} characters allowed.`);
        value = value.substring(0, currentQuestion.charLimit); // Truncate the value to the charLimit
        isValid = false;
    } 

    if (currentQuestion?.noSpecialChars) {
        const containsSpecialChars = /[^a-zA-Z0-9]/g.test(value);
        const enterChar = /[\n\r]/g.test(value);
        if (containsSpecialChars && !enterChar) {
            setErrorMessage('Special characters are not allowed.');
            if (value.length === 0) isValid = false;
            value = value.replace(/[^a-zA-Z0-9]/g, ''); // Remove any special characters  
        } else if (enterChar) {
            value = value.replace(/[\n\r]/g, ''); // Remove newline characters
        }
    }
      if (currentSectionIndex === 1)
      {    if (words.includes("percentage") || currentQuestion?.question.includes("What is the accuracy")) {
            // Check if the value is numeric with an optional dot
            const isNumericAndDot = /^\d*\.?\d*$/.test(value);
            if (!isNumericAndDot) {
                setErrorMessage('Please enter a valid numeric value.');
                value = value.replace(/[^0-9.]/g, ''); // Remove any non-numeric characters
                const dotIndex = value.indexOf('.');
                if (dotIndex !== -1) {
                    value = value.slice(0, dotIndex + 1) + value.slice(dotIndex + 1).replace(/\./g, ''); // Remove extra dots
                }
                if (value.length === 0) isValid = false;
            }
        
            // Check if the value represents a valid percentage (0 to 100)
            const percentage = parseFloat(value);

            if (isNaN(percentage) || percentage < 0 || percentage > 100) {
                setErrorMessage('Please enter a valid accuracy percentage between 0 and 100.');
                // No leading zero unless it's part of "0.x" decimal input
                if (value.length === 2 && value[0] === '0' && value[1] !== '.') {
                    value = '';
                    isValid = false;
                }
                
                // Prevent further input if the value would exceed 100
                if (percentage > 100) {
                    isValid = true;
                    if (value.startsWith('100')) {
                        value = '100'; // Set value to "100" if it would exceed 100
                    } else {
                        value = value.slice(0, 2); // Truncate to prevent exceeding range
                    }
                } else {
                    // Allow only numeric input and a single decimal point
                    value = value.replace(/[^0-9.]/g, '');
                }
            
                if (value.length === 0) isValid = false;
            
            } else {
                // Handle leading zero in a two-digit input without a decimal
                if (value.length === 2 && value[0] === '0' && value[1] !== '.') {
                    setErrorMessage('Please enter a valid accuracy percentage between 0 and 100.');
                    value = '';
                    isValid = false;
                } else if (percentage === 100 && value.includes('.')) {
                    // If the value is 100, remove any decimal points
                    setErrorMessage('100 should be entered as a whole number without decimals.');
                    value = "100"; // Set value to "100" without any decimals
                    isValid = true;
                } else if (value.length > 5) {
                    // Restrict length to 5 characters for percentages below 100
                    setErrorMessage('No more than 2 digits after the decimal point.');
                    value = value.slice(0, 5); // Truncate to 5 characters
                    isValid = true;
                } else {
                    isValid = true;
                }
            }
            
            setMessage(value); // Update the message with the valid value
            
              
        
        } else if (currentQuestion?.question.includes("What is the number") || currentQuestion?.question.includes("Amy Walker") || currentQuestion?.question.includes("How many values") || currentQuestion?.question.includes("How many") || currentQuestion?.question.includes('threshold')) {
            const isNumeric = /^\d+$/.test(value);
            if (!isNumeric) {
                setErrorMessage('Please enter an integer value.');
                value = value.replace(/[^0-9]/g, ''); // Remove any non-numeric characters
                if (value.length === 0) isValid = false;
            }
        }
        }else if (currentSectionIndex === 0){
          console.log("Current section index is:", currentSectionIndex);
          if (currentQuestionIndex !== 0 && value.length < 10){
            console.log("Current question index is:", currentQuestionIndex);
            setErrorMessage(`Please provide a detailed answer. Minimum 10 words required.`);
            isValid = false;
          }
        }
    setMessage(value); // Update the message with the valid value
    setIsInputValid(isValid); // Update the validity state
};



const handleSendMessage = (answer = message, skip = false) => {
  const currentQuestion = questionMap[currentQuestionIndex];
  setErrorMessage('');

  if (currentQuestion.id === 8){
    if (answer === 'Never'){
      console.log("Setting logical skip to true");
      setLogicalSkip(true);
    }else{
      setLogicalSkip(false);
    }
  }

  const messageWords = message.split(' ').filter((word) => word.trim() !== '');

  if (!skip && currentQuestion?.required && currentSectionIndex === 3 &&  messageWords.length < 10 && currentQuestionIndex < questionMap.length - 1) {
    setErrorMessage(`Please provide a detailed answer. Minimum 10 words required.`);
    return;
  }

  if (skip && !currentQuestion?.required) {
      setMessage('');
      moveToNextQuestion();
      return;
  }



  if (answer.trim()) {
      setBackButtonDisabled(true);
      setShowOtherTextField(false);
      setShowAnswerOptions(false);
      setIsQuestionVisible(false);

      const newChatLog = [...chatLog, { sender: 'You', message: answer, questionIndex: currentQuestionIndex, question_id: currentQuestion.id, sectionIndex: currentSectionIndex, order: currentQuestion.order }];
      setChatLog(newChatLog);
      setMessage('');

      setTimeout(() => {
          moveToNextQuestion(answer === 'Never' && currentQuestion.id === 8);
          setBackButtonDisabled(false);
      }, 300);
  }

};

  const moveToNextQuestion = (skipNext = false) => {
    
    if (currentQuestionIndex < questionMap.length - 1) {
      let nextIndex = currentQuestionIndex + 1;
      if (nextIndex - 1 === 8 && skipNext) 
        {
          nextIndex = nextIndex + 1
        };
      console.log("Next question index:", questionMap[nextIndex]?.id);
      console.log("Question Map"  , questionMap);

      if (questionMap[nextIndex]?.id === 76) {
        console.log("this question is title_desc");
        sendSystemMessage(fetchedSections[currentSectionIndex].questions[nextIndex].question);
        nextIndex = nextIndex + 1;
      }
      sendSystemMessage(questionMap[nextIndex]?.question);
      setCurrentQuestionIndex(nextIndex);
      setShowAnswerOptions(true);
      setIsQuestionVisible(true);
      setIsInputValid(false);

    } else if (currentSectionIndex < fetchedSections.length - 1) {
      const nextSectionIndex = currentSectionIndex + 1;
      setCurrentSectionIndex(nextSectionIndex);
      setCurrentQuestionIndex(0);
      sendSystemMessage(fetchedSections[nextSectionIndex]?.title_desc);
      sendSystemMessage(fetchedSections[nextSectionIndex]?.questions[0]?.question);
      setShowAnswerOptions(true);
      setIsQuestionVisible(true);
      submitSection(fetchedSections[currentSectionIndex].questions[currentQuestionIndex].id);
    } else {
      if (!isCompleted) {
        setIsCompleted(true);
        onQuestionnaireComplete();
        sendSystemMessage("Thank you for your participation!");
        submitSection(fetchedSections[currentSectionIndex].questions[currentQuestionIndex].id);
      }
    }
  };

  const sendSystemMessage = (systemMessage) => {
    setChatLog((prevChatLog) => [...prevChatLog, { sender: 'Researchers', message: systemMessage }]);
  };

  const handleBack = () => {

    console.log("Current question index:", currentQuestionIndex);
    console.log("Current section index:", currentSectionIndex);

    if (currentQuestionIndex > 0 && currentSectionIndex >= 0) {
      let prevIndex = currentQuestionIndex - 1;
      console.log("Previous question index:", prevIndex);
      console.log("Logical skip in handleBack:", logicalSkip);
      if (logicalSkip && prevIndex === 9) {
        console.log("Logical Skip is true");
        prevIndex = prevIndex - 1;
      }


      const updatedChatLog = [...chatLog];

      const previousAnswer = updatedChatLog.find(
        (entry) => entry.sender === 'You' && entry.questionIndex === prevIndex && entry.sectionIndex === currentSectionIndex
      )?.message || '';
      

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

        setMessage(previousAnswer);


        if (!updatedChatLog.some((entry) => entry.message === previousQuestion)) {
          sendSystemMessage(previousQuestion);
        }

      }, 300);
    }
  };

  const isSendButtonDisabled = () => {
    return !isInputValid;
};


  const handleOptionClick = (option) => {
    if (option === "Other" || option === "Other (please specify)") {
      setShowOtherTextField(true);
      setMessage(""); 
      setShowOtherTextField(false);
      handleSendMessage(option); // Send the selected option as the answer
    }
    else {
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
            <div 
              key={index} 
              className={`chat-message ${chat.sender === 'You' ? 'user-message' : 'system-message'}`}
              style={{
                wordWrap: 'break-word',
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap',
                maxWidth: '100%',
              }}
            >
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
                    display: currentQuestionIndex === 0  ? 'none' : 'block' 
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
                        minLength={
                          currentSectionIndex === 3 ? 20 : 0
                        }
                        value={message}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !isSendButtonDisabled()) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                          else if(message.length < questionMap[currentQuestionIndex]?.charLimit && e.key === 'Enter' && currentSectionIndex === 0 && currentQuestionIndex === 0){
                            e.preventDefault();
                            setErrorMessage(`Prolific ID should be 24 characters long.`);
                          }

                          if (e.key === 'Backspace' && message.length === 1){
                            e.preventDefault();
                            setIsInputValid(false);
                            setMessage('');
                            isSendButtonDisabled();
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
