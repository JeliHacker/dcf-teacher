import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useChat from '../hooks/useChat';

function TeacherChat({ chatHistory, isLoading, userMessage, setUserMessage, sendMessage }) {
  const handleSendMessage = () => {
      sendMessage(userMessage); // Use the sendMessage function from the custom hook
  };


  return (
    <div className="guide">
      <h2>Chat</h2>
      <div className="chat-container">
        <div className="chat-history">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender}`}>
              <strong>{msg.sender === 'user' ? 'You' : 'Bot'}: </strong>{msg.text}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="Ask the teacher..."
            disabled={isLoading}
          />
          <button onClick={handleSendMessage} disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TeacherChat;

