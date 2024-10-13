import React, { useState, useEffect, useRef } from 'react';

const Questionnaire = ({ onClose }) => {
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track the current question
  const chatBodyRef = useRef(null);

  // Predefined list of questions from the system
  const questions = [
    "What is your Prolific ID?",
    "How old are you?",
    "What is your highest level of education?",
    "Describe your job in the medical field in your own terms.",
    "How many years of professional experience do you have in the medical field?"
  ];

  // Reset the chat on reload and send the first question
  useEffect(() => {
    // Clear chat log and start with the first question
    setChatLog([{ sender: 'Researchers', message: questions[0] }]);
  }, []); // Only run on component mount

  // Handle user message send
  const handleSendMessage = () => {
    if (message.trim()) {
      // Add user message to the chat log
      const newChatLog = [...chatLog, { sender: 'You', message }];
      setChatLog(newChatLog);
      setMessage('');

      // Simulate sending the next system question after a brief delay
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          const nextIndex = currentQuestionIndex + 1;
          sendSystemMessage(questions[nextIndex]);
          setCurrentQuestionIndex(nextIndex); // Update to the next question index
        } else {
          sendSystemMessage("Thank you for completing the questionnaire!");
        }
      }, 1000);
    }
  };

  // Function to send system (researcher) messages
  const sendSystemMessage = (systemMessage) => {
    setChatLog((prevChatLog) => [...prevChatLog, { sender: 'Researchers', message: systemMessage }]);
  };

  // Auto-scroll to the bottom when a new message is added
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatLog]); // Trigger on chatLog update

  // Function to handle pressing Enter key to send a message
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();  // Prevents default behavior of form submission
      handleSendMessage();
    }
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
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}  // Add this line to listen for Enter key press
          placeholder="Type your answer..."
        />
        <button onClick={handleSendMessage}>
          <img
            src='/assets/send_arrow.svg'
            alt='Send'
            className='send-icon'
            style={{ cursor: 'pointer' }}
          />
        </button>
      </div>
    </div>
  );
};

export default Questionnaire;
