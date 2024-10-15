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
  const [showAnswerOptions, setShowAnswerOptions] = useState(false); // State to control answer visibility
  const [isQuestionVisible, setIsQuestionVisible] = useState(true); // State to control question visibility
  const chatBodyRef = useRef(null);

  const sections = [
    {
      sectionTitle: 'The following questions will gather background information to understand how your experience relates to your interaction with the system.',
      questions: [
        { question: "What is your Prolific ID?", answers: [], charLimit: 24, noSpecialChars: true },
        { question: "How old are you?", answers: ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"], charLimit: null, noSpecialChars: false },
        { question: "What is your highest level of education?", answers: ["Highschool diploma", "Bachelor’s degree", "Master’s degree", "Doctoral Degree (PhD)", "Medical degree (e.g., MD, DO)", "Other"], charLimit: null, noSpecialChars: false },
        { question: "Describe your job in the medical field in your own terms.", answers: [], charLimit: 100, noSpecialChars: false },
        { question: "How many years of professional experience do you have in the medical field?", answers: ["None", "1-4 years", "5-14 years", "15+ years"], charLimit: null, noSpecialChars: false },
        { question: "Are you done with this section and agree for your answers so far to be saved permanently?", answers: ["Yes"], charLimit: null, noSpecialChars: false }
      ]
    },
    {
      sectionTitle: (
        <>
          Take some time to explore the system (<span style={{ textDecoration: "underline" }}>3-5 minutes</span>). Once ready, answer the questions based on your findings. Feel free to skip any questions.
        </>
      ),
      questions: [
        { question: "Is Jack Smith’s age below or above the average age of MCI patients?", answers: ["Below", "Equal", "Above"], charLimit: null, noSpecialChars: false },
        { question: "What percentage of healthy patients never use tablets?", answers: [], charLimit: 2, noSpecialChars: false },
        { question: "Are you done with this section and agree for your answers so far to be saved permanently?", answers: ["Yes"], charLimit: null, noSpecialChars: false }
      ]
    },
    {
      sectionTitle: 'You will now be asked to rate your agreement with a series of statements.',
      questions: [
        { question: "\"Using this app would allow me to accomplish the related tasks more quickly. \"", answers: ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"], charLimit: null, noSpecialChars: false },
        { question: "\"Using this app would enhance my effectiveness on the tasks related with its usage. \"", answers: ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"], charLimit: null, noSpecialChars: false },
        { question: "\"Are you done with this section and agree for your answers so far to be saved permanently?\"", answers: ["Yes"], charLimit: null, noSpecialChars: false }
      ]
    }
  ];

  const currentSection = sections[currentSectionIndex];
  const questionMap = currentSection.questions;

  const isValidProlificID = (input) => /^[a-zA-Z0-9]{24}$/.test(input);

  useEffect(() => {
    if (isCompleted) {
      onQuestionnaireComplete(true);
    }
  }, [isCompleted, onQuestionnaireComplete]);

  useEffect(() => {
    sendSystemMessage(currentSection.sectionTitle);
    sendSystemMessage(questionMap[0].question);
  }, []);

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
      if(/[^a-zA-Z0-9]/g.test(value))
        {
          setErrorMessage('Please enter a valid Prolific ID.');
        }
        else{
          setErrorMessage('');
        }
      value = value.replace(/[^a-zA-Z0-9]/g, '');
      setMessage(value);
    } else {
      setMessage(value);
    }
  };

  const handleSendMessage = (answer = message) => {
    if (answer.trim()) {
      const currentQuestion = questionMap[currentQuestionIndex];

      /*
      if (currentSectionIndex === 0 && currentQuestionIndex === 0 && !isValidProlificID(answer)) {
        setErrorMessage("This isn't a valid Prolific ID.");
        return;
      }*/

      setErrorMessage('');
      setBackButtonDisabled(true);
      setShowOtherTextField(false);
      setShowAnswerOptions(false); 
      setIsQuestionVisible(false); 

      const newChatLog = [...chatLog, { sender: 'You', message: answer, questionIndex: currentQuestionIndex }];
      setChatLog(newChatLog);
      setMessage('');

      setTimeout(() => {
        if (currentQuestionIndex < questionMap.length - 1) {
          // Move to the next question in the current section
          const nextIndex = currentQuestionIndex + 1;
          sendSystemMessage(questionMap[nextIndex].question);
          setCurrentQuestionIndex(nextIndex);
          setShowAnswerOptions(true);
          setIsQuestionVisible(true); // Show the question after the delay
        } else if (currentSectionIndex < sections.length - 1) {
          // Move to the next section 
          const nextSectionIndex = currentSectionIndex + 1;
          setCurrentSectionIndex(nextSectionIndex);
          setCurrentQuestionIndex(0);
          sendSystemMessage(sections[nextSectionIndex].sectionTitle);

          if (nextSectionIndex === 1) { // Section 2 starts at index 1
            setTimeout(() => {
              sendSystemMessage(sections[nextSectionIndex].questions[0].question);

              // Delay the display of answer options for section 2 after the question appears
              setTimeout(() => {
                setShowAnswerOptions(true); 
                setIsQuestionVisible(true); 
              }, 2000); // Delay options by 2 seconds
            }, 3000); // 3000ms = 3 seconds delay for the question
          } else {
            sendSystemMessage(sections[nextSectionIndex].questions[0].question);
            setShowAnswerOptions(true); 
            setIsQuestionVisible(true); 
          }
        } else {
          // Completed the last section
          if (!isCompleted) {
            setIsCompleted(true);
            sendSystemMessage("Thank you for your participation!");
          }
        }

        setBackButtonDisabled(false);
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
        
        /*
        if (questionMap[prevIndex].answers.length === 0) {
          //setMessage(previousAnswer);
          //setShowOtherTextField(true);
        } else {
          setShowOtherTextField(false);
        }*/
      }, 500);
    }
  };

  const isSendButtonDisabled = () => {
    const currentQuestion = questionMap[currentQuestionIndex];

    if (currentSectionIndex === 0 && currentQuestionIndex === 0) {
      return !isValidProlificID(message);
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
    <div className="chatbox">
      <div className="chatbox-header">
        <h3>Section {currentSectionIndex + 1} - Question {currentQuestionIndex + 1}/{questionMap.length}</h3>
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
              {currentQuestionIndex !== 0 && (
                <button
                  className="back-button"
                  onClick={handleBack}
                  disabled={backButtonDisabled}
                >
                  ← back to previous question
                </button>
              )}
            </div>

            {isQuestionVisible && (
              <div className="input-row">
                {(
                  questionMap[currentQuestionIndex].answers.length > 0 && !showOtherTextField && showAnswerOptions ? (
                    <div>
                      {currentQuestionIndex !== questionMap.length - 1 && (<p style={{ textAlign: 'right' }}>Please select an option:</p>)}
                      <div className="options">
                        {questionMap[currentQuestionIndex].answers.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleOptionClick(option)}
                            className="option-button"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      <textarea
                        maxLength={questionMap[currentQuestionIndex].charLimit || 100}
                        value={message}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !isSendButtonDisabled()) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder={showOtherTextField ? "Please specify..." : "Type your answer..."}
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
                  )
                )}
              </div>
            )}
          </>
        )}
      </div>

      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};

export default Questionnaire;
