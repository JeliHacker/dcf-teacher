import { useState } from 'react';
import axios from 'axios';

function useChat() {
    const [chatHistory, setChatHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userMessage, setUserMessage] = useState('');


    const sendMessage = async (message) => {
        if (message.trim() === '') return;

        setIsLoading(true);

        try {
            // Make request to your Flask API instead of Gemini directly
            const response = await axios.post('http://localhost:8000/api/ask', { prompt: message });

            // Add both user's message and bot's response to the chat history at once
            const newMessage = { sender: 'user', text: message };
            const botResponse = { sender: 'bot', text: response.data };

            setChatHistory(prevHistory => [...prevHistory, newMessage, botResponse]);
        } catch (error) {
            console.error('Error fetching response from Gemini API:', error);
            
            const newMessage = { sender: 'user', text: message };
            setChatHistory(prevHistory => [
                ...prevHistory,
                newMessage,
                { sender: 'bot', text: `Error fetching response. ${JSON.stringify(error)} ${error.message} ${error.response}` }
            ]);
        } finally {
            setIsLoading(false);
            setUserMessage('');
        }
    };

    return {
        chatHistory,
        isLoading,
        userMessage,
        setUserMessage,
        sendMessage,
        setChatHistory, // You might need this if you want to manipulate history externally
    };
}

export default useChat;
