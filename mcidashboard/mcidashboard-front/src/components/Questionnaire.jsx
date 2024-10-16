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
  const chatBodyRef = useRef(null);

  const sections = [
    {
      sectionTitle: 'The following questions will gather background information to understand how your experience relates to your interaction with the system.',
      questions: [
        { question: "What is your Prolific ID?", answers: [], charLimit: 24, noSpecialChars: true, skippable: false },
        { question: "How old are you?", answers: ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"], charLimit: null, noSpecialChars: false, skippable: false },
        { question: "What is your highest level of education?", answers: ["Highschool diploma", "Bachelor’s degree", "Master’s degree", "Doctoral Degree (PhD)", "Medical degree (e.g., MD, DO)", "Other"], charLimit: null, noSpecialChars: false, skippable: false },
        { question: "Describe your job in the medical field in your own terms.", answers: [], charLimit: 100, noSpecialChars: false, skippable: true },
        { question: "How many years of professional experience do you have in the medical field?", answers: ["None", "1-4 years", "5-14 years", "15+ years"], charLimit: null, noSpecialChars: false, skippable: false },
        { question: "Are you done with this section and agree for your answers so far to be saved permanently?", answers: ["Yes"], charLimit: null, noSpecialChars: false, skippable: false }
      ]
    },
    {
      sectionTitle: (
        <>
          Take some time to explore the system (<span style={{ textDecoration: "underline" }}>3-5 minutes</span>). Once ready, answer the questions based on your findings. Feel free to skip any questions.
        </>
      ),
      questions: [
        { question: "Is Jack Smith’s age below or above the average age of MCI patients?", answers: ["Below", "Equal", "Above"], charLimit: null, noSpecialChars: false, skippable: true },
        { question: "What percentage of healthy patients never use tablets?", answers: [], charLimit: 2, noSpecialChars: false, skippable: true },
        { question: "Are you done with this section and agree for your answers so far to be saved permanently?", answers: ["Yes"], charLimit: null, noSpecialChars: false, skippable: false }
      ]
    },
    {
      sectionTitle: 'You will now be asked to rate your agreement with a series of statements.',
      questions: [
        { question: "\"Using this app would allow me to accomplish the related tasks more quickly. \"", answers: ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"], charLimit: null, noSpecialChars: false, skippable: false },
        { question: "\"Using this app would enhance my effectiveness on the tasks related with its usage. \"", answers: ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"], charLimit: null, noSpecialChars: false, skippable: false },
        { question: "Are you done with this section and agree for your answers so far to be saved permanently?", answers: ["Yes"], charLimit: null, noSpecialChars: false, skippable: false }
      ]
    },
    {
      sectionTitle: 'In this section, please provide detailed feedback on your experience using the web app. Aim for 30-50 words per question and be specific (e.g., mention tabs, subsections, graphs). You may respond in English, Dutch, French, Greek, Russian, Azerbaijani, or Chinese.',
      questions: [
        { question: "Which features of the web application contributed the most to accomplishing your tasks effectively, and what made them particularly helpful? ", answers: [], charLimit: null, noSpecialChars: false, skippable: true },
        { question: "Which parts of the web application did you find yourself using the most, and what made them easy to access and use? ", answers: [], charLimit: null, noSpecialChars: false, skippable: true },
        { question: "Are you done with this section and agree for your answers so far to be saved permanently?", answers: ["Yes"], charLimit: null, noSpecialChars: false, skippable: false }
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
      if(/[^a-zA-Z0-9]/g.test(value)) {
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

    // Allow skipping if the current question is skippable
    if (skip && currentQuestion.skippable) {
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
      }, 1000);
    }
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < questionMap.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      sendSystemMessage(questionMap[nextIndex].question);
      setCurrentQuestionIndex(nextIndex);
      setShowAnswerOptions(true);
      setIsQuestionVisible(true);
    } else if (currentSectionIndex < sections.length - 1) {
      const nextSectionIndex = currentSectionIndex + 1;
      setCurrentSectionIndex(nextSectionIndex);
      setCurrentQuestionIndex(0);
      sendSystemMessage(sections[nextSectionIndex].sectionTitle);
      sendSystemMessage(sections[nextSectionIndex].questions[0].question);
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
    <div>
      <div className="chatbox" >
        <div className="chatbox-header">
        <p style={{marginTop: 0}}>
          <span style={{fontSize: 14}}><strong style={{fontSize: 18}}>QUESTIONNAIRE</strong> <br/>PART <span style={{fontSize: 24}}>{currentSectionIndex + 1}</span>/{sections.length} - QUESTION <span style={{fontSize: 24}}>{currentQuestionIndex + 1}</span>/{questionMap.length}
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
                style={{ display: currentQuestionIndex === 0 ? 'none' : 'block' }}  
              >
                ← back to previous question
              </button>
                {questionMap[currentQuestionIndex].skippable && (
                          <button
                            onClick={() => handleSendMessage("", true)} 
                            className="skip-button"
                            style={{alignItems: currentQuestionIndex === 0 ? 'flex-end': ''}}
                          >
                            skip →
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
                          maxLength={questionMap[currentQuestionIndex].charLimit}
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
    </div>
  );
};

export default Questionnaire;