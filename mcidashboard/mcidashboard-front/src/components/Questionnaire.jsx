import React, { useState } from 'react';

const Questionnaire = ({ onClose }) => {
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setChatLog([...chatLog, { sender: 'You', message }]);
      setMessage('');
    }
  };

  return (
    <div className="chatbox">
      <div className="chatbox-header">
        <h3>Chat</h3>
      </div>
      <div className="chatbox-body">
        {chatLog.map((chat, index) => (
          <div key={index} className="chat-message">
            <strong>{chat.sender}:</strong> {chat.message}
          </div>
        ))}
      </div>
      <div className="chatbox-footer">
        <input 
          type="text" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          placeholder="Type a message"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Questionnaire;
