import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TeacherChat({ currentSection, sections, navigateToSection }) {
    const [chatHistory, setChatHistory] = useState([]);
    const [userMessage, setUserMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = async () => {
        if (userMessage.trim() === '') return;
    
        // Add user's message to the chat history
        const newMessage = { sender: 'user', text: userMessage };
        setChatHistory([...chatHistory, newMessage]);
    
        setIsLoading(true);
    
        try {
            // Make request to your Flask API instead of Gemini directly
            const response = await axios.post('http://localhost:8000/api/ask', { prompt: userMessage });
            console.log("response!")
            console.log(typeof(response));
            console.log(response);

        
            const botResponse = { sender: 'bot', text: response.data };
            setChatHistory([...chatHistory, newMessage, botResponse]);
        } catch (error) {
            console.error('Error fetching response from Gemini API:', error);
            setChatHistory([...chatHistory, newMessage, { sender: 'bot', text: `Error fetching response. ${JSON.stringify(error)} ${error.message} ${error.response}` }]);
        } finally {
            setIsLoading(false);
            setUserMessage('');
        }
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

